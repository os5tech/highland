import { navigation } from "@/app/_data/dashboard";
import { BrandLockup } from "./BrandLockup";

type DashboardSidebarProps = {
  activeHref?: string;
};

export function DashboardSidebar({ activeHref = "/#command" }: DashboardSidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <BrandLockup />

      <nav className="nav-list">
        {navigation.map((item) => (
          <a className={item.href === activeHref ? "active" : ""} href={item.href} key={item.label}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Current Package</p>
        <code>Payroll + Job Costing MVP</code>
        <button type="button">Refresh sources</button>
      </div>
    </aside>
  );
}
