import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { db } from "./db";
import { looksLikeEmail, normalizePhoneNumber } from "./phone";

const SESSION_COOKIE = "intelligen_session";
const PENDING_2FA_COOKIE = "intelligen_2fa_pending";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days
const PENDING_2FA_DURATION = 60 * 5; // 5 minutes

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(PENDING_2FA_COOKIE);
}

export async function createPending2FA(userId: string) {
  const token = await new SignJWT({ userId, type: "2fa_pending" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${PENDING_2FA_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(PENDING_2FA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_2FA_DURATION,
    path: "/",
  });
}

export async function getPending2FAUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PENDING_2FA_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "2fa_pending") return null;
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function clearPending2FA() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_2FA_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect("/dashboard");
  }
  return session;
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function getUserByPhone(phone: string) {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;
  return db.user.findUnique({ where: { phoneNumber: normalized } });
}

export async function getUserByLoginIdentifier(identifier: string) {
  const value = identifier.trim();
  if (looksLikeEmail(value)) {
    return getUserByEmail(value);
  }
  return getUserByPhone(value);
}
