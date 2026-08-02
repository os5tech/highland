import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { rolesFromEntraClaims } from "./role-mapping";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error("[next-auth:error]", code, metadata);
    },
    warn(code) {
      console.warn("[next-auth:warn]", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[next-auth:debug]", code, metadata);
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    AzureADProvider({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID ?? "",
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET ?? "",
      tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      const claims = profile as Record<string, unknown> | undefined;
      const email = (token.email ?? claims?.email ?? claims?.preferred_username) as string | undefined;
      token.entraObjectId = (claims?.oid ?? claims?.sub ?? token.sub) as string | undefined;
      token.tenantId = (claims?.tid ?? process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID) as string | undefined;
      token.roles = rolesFromEntraClaims(claims?.groups, email);

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub ?? token.entraObjectId ?? "");
        session.user.entraObjectId = typeof token.entraObjectId === "string" ? token.entraObjectId : null;
        session.user.tenantId = typeof token.tenantId === "string" ? token.tenantId : null;
        session.user.roles = Array.isArray(token.roles) ? token.roles : ["field_employee"];
      }

      return session;
    },
  },
};
