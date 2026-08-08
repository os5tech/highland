"use client";

import { useState } from "react";
import { navigation } from "@/app/_data/dashboard";
import { BrandLockup } from "./BrandLockup";

type DashboardSidebarProps = {
  activeHref?: string;
  canAccessAdminVault?: boolean;
};

export function DashboardSidebar({ activeHref = "/#dashboard", canAccessAdminVault = false }: DashboardSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const visibleNavigation = navigation.filter((item) => !item.requiresAdmin || canAccessAdminVault);

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
              href={item.href}
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
