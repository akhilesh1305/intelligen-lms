/**
 * Resolve the browser-facing origin for redirects.
 * Avoids broken redirects to 0.0.0.0 when the server binds to all interfaces.
 */
export function getPublicOrigin(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host && !host.startsWith("0.0.0.0")) {
      const proto = forwardedProto ?? (host.includes("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  }

  const host = request.headers.get("host");
  if (host && !host.startsWith("0.0.0.0")) {
    const proto =
      forwardedProto ?? (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
    return `${proto}://${host}`;
  }

  const internal = new URL(request.url);
  if (internal.hostname === "0.0.0.0" || internal.hostname === "[::]") {
    const port = internal.port || process.env.PORT || "3001";
    return `http://localhost:${port}`;
  }

  return internal.origin;
}

export function publicRedirect(path: string, request: Request) {
  return new URL(path.startsWith("/") ? path : `/${path}`, getPublicOrigin(request));
}
