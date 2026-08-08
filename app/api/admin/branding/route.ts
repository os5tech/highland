import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/db";
import { brandingSettings } from "@/db/schema";
import { getCurrentSession } from "@/src/server/auth/current-session";
import { getDashboardSecurityContext } from "@/src/server/controllers/dashboardController";

const BRANDING_ID = "highland";
const MAX_LOGO_DATA_URL_LENGTH = 700_000;
const imageDataUrlPattern = /^data:image\/(png|jpeg|jpg|svg\+xml|webp);base64,[a-z0-9+/=]+$/i;

type BrandingPatch = {
  primaryLogoDataUrl?: string | null;
  primaryLogoFileName?: string | null;
  primaryLogoMimeType?: string | null;
  compactLogoDataUrl?: string | null;
  compactLogoFileName?: string | null;
  compactLogoMimeType?: string | null;
};

function emptyBranding() {
  return {
    id: BRANDING_ID,
    primaryLogoDataUrl: null,
    primaryLogoFileName: null,
    primaryLogoMimeType: null,
    compactLogoDataUrl: null,
    compactLogoFileName: null,
    compactLogoMimeType: null,
  };
}

function publicBrandingPayload(row: typeof brandingSettings.$inferSelect | undefined) {
  if (!row) {
    return emptyBranding();
  }

  return {
    id: row.id,
    primaryLogoDataUrl: row.primaryLogoDataUrl,
    primaryLogoFileName: row.primaryLogoFileName,
    primaryLogoMimeType: row.primaryLogoMimeType,
    compactLogoDataUrl: row.compactLogoDataUrl,
    compactLogoFileName: row.compactLogoFileName,
    compactLogoMimeType: row.compactLogoMimeType,
  };
}

function assertImageDataUrl(value: string | null | undefined, label: string) {
  if (!value) {
    return;
  }

  if (value.length > MAX_LOGO_DATA_URL_LENGTH) {
    throw new Error(`${label} is too large. Please use an image under about 500 KB.`);
  }

  if (!imageDataUrlPattern.test(value)) {
    throw new Error(`${label} must be a PNG, JPG, SVG, or WebP image.`);
  }
}

export async function GET() {
  try {
    const [row] = await getDb().select().from(brandingSettings).where(eq(brandingSettings.id, BRANDING_ID)).limit(1);

    return NextResponse.json({ branding: publicBrandingPayload(row) });
  } catch {
    return NextResponse.json({ branding: emptyBranding() });
  }
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const security = getDashboardSecurityContext(session);

  if (!security.permissions.canAccessAdminVault) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: BrandingPatch;

  try {
    body = (await request.json()) as BrandingPatch;
    assertImageDataUrl(body.primaryLogoDataUrl, "Primary logo");
    assertImageDataUrl(body.compactLogoDataUrl, "Compact logo");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid branding payload." },
      { status: 400 },
    );
  }

  const now = new Date();
  const [existing] = await getDb().select().from(brandingSettings).where(eq(brandingSettings.id, BRANDING_ID)).limit(1);
  const values = {
    primaryLogoDataUrl: body.primaryLogoDataUrl === undefined ? existing?.primaryLogoDataUrl ?? null : body.primaryLogoDataUrl,
    primaryLogoFileName: body.primaryLogoFileName === undefined ? existing?.primaryLogoFileName ?? null : body.primaryLogoFileName,
    primaryLogoMimeType: body.primaryLogoMimeType === undefined ? existing?.primaryLogoMimeType ?? null : body.primaryLogoMimeType,
    compactLogoDataUrl: body.compactLogoDataUrl === undefined ? existing?.compactLogoDataUrl ?? null : body.compactLogoDataUrl,
    compactLogoFileName: body.compactLogoFileName === undefined ? existing?.compactLogoFileName ?? null : body.compactLogoFileName,
    compactLogoMimeType: body.compactLogoMimeType === undefined ? existing?.compactLogoMimeType ?? null : body.compactLogoMimeType,
    updatedAt: now,
  };

  const [row] = await getDb()
    .insert(brandingSettings)
    .values({ id: BRANDING_ID, ...values, createdAt: now })
    .onConflictDoUpdate({
      target: brandingSettings.id,
      set: values,
    })
    .returning();

  return NextResponse.json({ branding: publicBrandingPayload(row) });
}
