import { eq, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getCurrentSession } from "@/src/server/auth/current-session";

function normalizePhone(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function isValidPhone(value: string | null) {
  if (!value) {
    return true;
  }

  return /^\+\d{1,4}\s[()\-.\s\d]{4,24}$/.test(value);
}

async function findOrCreateUser() {
  const session = await getCurrentSession();
  const sessionUser = session?.user;

  if (!sessionUser?.email || !sessionUser.entraObjectId) {
    return null;
  }

  const db = getDb();
  const [existing] = await db
    .select()
    .from(users)
    .where(or(eq(users.entraObjectId, sessionUser.entraObjectId), eq(users.email, sessionUser.email)))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(users)
    .values({
      entraObjectId: sessionUser.entraObjectId,
      email: sessionUser.email,
      name: sessionUser.name ?? sessionUser.email,
    })
    .returning();

  return created;
}

export async function GET() {
  const user = await findOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    profile: {
      mobilePhone: user.mobilePhone,
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await findOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { mobilePhone?: unknown };
  const mobilePhone = normalizePhone(body.mobilePhone);

  if (!isValidPhone(mobilePhone)) {
    return NextResponse.json({ error: "Enter a country code and mobile number." }, { status: 400 });
  }

  const [updated] = await getDb()
    .update(users)
    .set({ mobilePhone, updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({
    profile: {
      mobilePhone: updated.mobilePhone,
    },
  });
}
