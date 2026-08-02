import type { AppRole } from "@/src/server/domain/roles";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      entraObjectId?: string | null;
      tenantId?: string | null;
      roles: AppRole[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    entraObjectId?: string | null;
    tenantId?: string | null;
    roles?: AppRole[];
  }
}
