import { randomBytes } from "crypto";
import { SsoProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { getSecuritySettings } from "./settings";

const SSO_STATE_COOKIE = "intelligen_sso_state";
const STATE_TTL = 600;

export type SsoProfile = {
  provider: SsoProvider;
  subjectId: string;
  email: string;
  name: string;
};

type ProviderConfig = {
  enabledKey: keyof Awaited<ReturnType<typeof getSecuritySettings>>;
  clientIdEnv: string;
  clientSecretEnv: string;
  getAuthUrl: (state: string, redirectUri: string) => string;
  getTokenUrl: () => string;
  getUserInfo: (accessToken: string) => Promise<{ sub: string; email: string; name: string }>;
};

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001")
  );
}

function getRedirectUri(provider: SsoProvider) {
  return `${getAppUrl()}/api/auth/sso/${provider.toLowerCase()}/callback`;
}

const PROVIDERS: Record<SsoProvider, ProviderConfig> = {
  GOOGLE: {
    enabledKey: "googleSsoEnabled",
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    getAuthUrl: (state, redirectUri) => {
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        access_type: "online",
        prompt: "select_account",
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    },
    getTokenUrl: () => "https://oauth2.googleapis.com/token",
    getUserInfo: async (accessToken) => {
      const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Google userinfo failed");
      const data = (await res.json()) as { sub: string; email: string; name?: string };
      return { sub: data.sub, email: data.email, name: data.name ?? data.email };
    },
  },
  MICROSOFT: {
    enabledKey: "microsoftSsoEnabled",
    clientIdEnv: "MICROSOFT_CLIENT_ID",
    clientSecretEnv: "MICROSOFT_CLIENT_SECRET",
    getAuthUrl: (state, redirectUri) => {
      const tenant = process.env.MICROSOFT_TENANT_ID ?? "common";
      const params = new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email User.Read",
        state,
        response_mode: "query",
      });
      return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${params}`;
    },
    getTokenUrl: () => {
      const tenant = process.env.MICROSOFT_TENANT_ID ?? "common";
      return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
    },
    getUserInfo: async (accessToken) => {
      const res = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Microsoft userinfo failed");
      const data = (await res.json()) as {
        id: string;
        mail?: string;
        userPrincipalName?: string;
        displayName?: string;
      };
      const email = data.mail ?? data.userPrincipalName ?? "";
      return {
        sub: data.id,
        email,
        name: data.displayName ?? email,
      };
    },
  },
  OKTA: {
    enabledKey: "oktaSsoEnabled",
    clientIdEnv: "OKTA_CLIENT_ID",
    clientSecretEnv: "OKTA_CLIENT_SECRET",
    getAuthUrl: (state, redirectUri) => {
      const issuer = process.env.OKTA_ISSUER!.replace(/\/$/, "");
      const params = new URLSearchParams({
        client_id: process.env.OKTA_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email",
        state,
      });
      return `${issuer}/v1/authorize?${params}`;
    },
    getTokenUrl: () => {
      const issuer = process.env.OKTA_ISSUER!.replace(/\/$/, "");
      return `${issuer}/v1/token`;
    },
    getUserInfo: async (accessToken) => {
      const issuer = process.env.OKTA_ISSUER!.replace(/\/$/, "");
      const res = await fetch(`${issuer}/v1/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Okta userinfo failed");
      const data = (await res.json()) as { sub: string; email: string; name?: string };
      return { sub: data.sub, email: data.email, name: data.name ?? data.email };
    },
  },
};

export function parseSsoProvider(value: string): SsoProvider | null {
  const upper = value.toUpperCase();
  if (upper in PROVIDERS) return upper as SsoProvider;
  return null;
}

export async function isSsoProviderEnabled(provider: SsoProvider) {
  const settings = await getSecuritySettings();
  const config = PROVIDERS[provider];
  return settings[config.enabledKey];
}

export function isSsoProviderConfigured(provider: SsoProvider) {
  const config = PROVIDERS[provider];
  if (provider === "OKTA" && !process.env.OKTA_ISSUER) return false;
  return Boolean(
    process.env[config.clientIdEnv] && process.env[config.clientSecretEnv]
  );
}

export async function createSsoState(provider: SsoProvider) {
  const state = randomBytes(24).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(SSO_STATE_COOKIE, `${provider}:${state}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_TTL,
    path: "/",
  });
  return state;
}

export async function verifySsoState(provider: SsoProvider, state: string) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SSO_STATE_COOKIE)?.value;
  cookieStore.delete(SSO_STATE_COOKIE);
  if (!raw) return false;
  const [storedProvider, storedState] = raw.split(":");
  return storedProvider === provider && storedState === state;
}

export async function getSsoAuthorizationUrl(provider: SsoProvider) {
  if (!(await isSsoProviderEnabled(provider))) {
    throw new Error("SSO provider is disabled");
  }
  if (!isSsoProviderConfigured(provider)) {
    throw new Error("SSO provider is not configured");
  }

  const state = await createSsoState(provider);
  const redirectUri = getRedirectUri(provider);
  return PROVIDERS[provider].getAuthUrl(state, redirectUri);
}

export async function exchangeSsoCode(
  provider: SsoProvider,
  code: string
): Promise<SsoProfile> {
  const config = PROVIDERS[provider];
  const redirectUri = getRedirectUri(provider);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: process.env[config.clientIdEnv]!,
    client_secret: process.env[config.clientSecretEnv]!,
  });

  const tokenRes = await fetch(config.getTokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenRes.ok) {
    throw new Error("SSO token exchange failed");
  }

  const tokenData = (await tokenRes.json()) as { access_token: string };
  const profile = await config.getUserInfo(tokenData.access_token);

  return {
    provider,
    subjectId: profile.sub,
    email: profile.email.toLowerCase(),
    name: profile.name,
  };
}

export async function getEnabledSsoProviders() {
  const settings = await getSecuritySettings();
  const providers: SsoProvider[] = [];

  for (const provider of ["GOOGLE", "MICROSOFT", "OKTA"] as SsoProvider[]) {
    const config = PROVIDERS[provider];
    if (
      settings[config.enabledKey] &&
      isSsoProviderConfigured(provider)
    ) {
      providers.push(provider);
    }
  }

  return providers;
}
