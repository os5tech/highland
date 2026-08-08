import { navigation } from "@/app/_data/dashboard";
import { BrandLockup } from "./BrandLockup";

export function DashboardSidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <BrandLockup />

      <nav className="nav-list">
        {navigation.map((item) => (
          <a className={item === "Command" ? "active" : ""} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
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
