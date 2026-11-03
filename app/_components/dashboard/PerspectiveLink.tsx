"use client";

import { useSearchParams } from "next/navigation";

type PerspectiveLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
};

export function PerspectiveLink({ children, className, href }: PerspectiveLinkProps) {
  const searchParams = useSearchParams();
  const perspective = searchParams.get("perspective");
  const separator = href.includes("?") ? "&" : "?";
  const resolvedHref = perspective ? `${href}${separator}perspective=${encodeURIComponent(perspective)}` : href;

  return (
    <a className={className} href={resolvedHref}>
      {children}
    </a>
  );
}
