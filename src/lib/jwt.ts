// src/lib/jwt.ts
export function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    // base64url -> base64
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
