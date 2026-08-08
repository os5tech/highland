import type { Session } from "next-auth";

const loopbackIps = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1", "localhost"]);

function normalizedIp(value: string) {
  return value.trim().replace(/^::ffff:/, "");
}

function configuredAllowedIps() {
  return (process.env.KEYSTONE_DEV_AUTH_ALLOWED_IPS ?? "")
    .split(",")
    .map(normalizedIp)
    .filter(Boolean);
}

function requestIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0];
  const realIp = headers.get("x-real-ip");
  const forwardedHost = headers.get("forwarded")?.match(/for="?([^";,]+)"?/i)?.[1];

  return normalizedIp(forwardedFor ?? realIp ?? forwardedHost ?? "");
}

function isDevelopmentBypassAllowed(headers: Headers) {
  if (process.env.KEYSTONE_DEV_AUTH_BYPASS !== "true") {
    return false;
  }

  const allowedIps = new Set([...loopbackIps, ...configuredAllowedIps()]);
  const ip = requestIp(headers);

  return ip.length === 0 || allowedIps.has(ip);
}

export function getDevelopmentSessionForRequest(headers: Headers): Session | null {
  if (!isDevelopmentBypassAllowed(headers)) {
    return null;
  }

  const email = process.env.KEYSTONE_DEV_AUTH_EMAIL ?? "MSTestAdmin@highland-ca.com";
  const name = process.env.KEYSTONE_DEV_AUTH_NAME ?? "MSTest Admin";

  return {
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    user: {
      id: "development-mstest-admin",
      name,
      email,
      image: null,
      entraObjectId: "development-bypass",
      tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID ?? null,
      roles: ["os5_admin", "payroll_admin", "accounting", "cfo"],
    },
  };
}
