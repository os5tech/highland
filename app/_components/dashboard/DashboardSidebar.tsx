"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { navigation } from "@/app/_data/dashboard";
import { BrandLockup } from "./BrandLockup";

type DashboardSidebarProps = {
  activeHref?: string;
  canAccessAdminVault?: boolean;
  mode?: "operations" | "time-submit" | "pm-review";
};

export function DashboardSidebar({ activeHref = "/#dashboard", canAccessAdminVault = false, mode = "operations" }: DashboardSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const perspective = searchParams.get("perspective");
  const perspectiveQuery = perspective ? `?perspective=${encodeURIComponent(perspective)}` : "";
  const visibleNavigation = navigation.filter((item) => {
    if (item.requiresAdmin && !canAccessAdminVault) {
      return false;
    }

    if (mode === "time-submit") {
      return item.href === "/#dashboard" || item.href === "/timesheet" || item.href === "/admin-vault";
    }

    if (mode === "pm-review") {
      return item.href === "/#dashboard" || item.href === "/#pm-approval" || item.href === "/admin-vault";
    }

    return true;
  });

  function hrefFor(href: string) {
    if (!perspectiveQuery || href === "/admin-vault") {
      return href;
    }

    if (href.startsWith("/#")) {
      return `/${perspectiveQuery}${href.slice(1)}`;
    }

    return `${href}${perspectiveQuery}`;
  }

  return (
    <aside className={isMenuOpen ? "sidebar is-open" : "sidebar"} aria-label="Primary navigation">
      <div className="sidebar-header">
        <BrandLockup />
        <button
          aria-controls="primary-navigation-panel"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span className="hamburger-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className="sidebar-content" id="primary-navigation-panel">
        <nav className="nav-list">
          {visibleNavigation.map((item) => (
            <a
              className={item.href === activeHref ? "active" : ""}
              href={hrefFor(item.href)}
              key={item.label}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Current Package</p>
          <code>Payroll + Job Costing MVP</code>
          <button type="button">Refresh sources</button>
        </div>
      </div>
    </aside>
  );
}
