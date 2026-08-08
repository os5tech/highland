"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type BrandingPayload = {
  primaryLogoDataUrl: string | null;
};

export function BrandLockup() {
  const [primaryLogoDataUrl, setPrimaryLogoDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBranding() {
      try {
        const response = await fetch("/api/admin/branding", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { branding?: BrandingPayload };

        if (isMounted) {
          setPrimaryLogoDataUrl(payload.branding?.primaryLogoDataUrl ?? null);
        }
      } catch {
        if (isMounted) {
          setPrimaryLogoDataUrl(null);
        }
      }
    }

    function handleBrandingUpdate(event: Event) {
      const customEvent = event as CustomEvent<BrandingPayload>;
      setPrimaryLogoDataUrl(customEvent.detail.primaryLogoDataUrl ?? null);
    }

    void loadBranding();
    window.addEventListener("keystone-branding-updated", handleBrandingUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("keystone-branding-updated", handleBrandingUpdate);
    };
  }, []);

  if (primaryLogoDataUrl) {
    return (
      <div className="brand brand-logo-only">
        <Image alt="Highland Construction" height={74} src={primaryLogoDataUrl} unoptimized width={238} />
      </div>
    );
  }

  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div>
        <p>Virtual Patrick</p>
        <strong>Highland Construction</strong>
      </div>
    </div>
  );
}
