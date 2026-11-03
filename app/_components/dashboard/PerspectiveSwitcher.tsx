"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { appRoles, type AppRole } from "@/src/server/domain/roles";

const roleLabels: Record<AppRole, string> = {
  field_employee: "Field Employee",
  time_intake_required: "Time Intake Required",
  project_manager: "Project Manager",
  project_executive: "Project Executive",
  payroll_admin: "Payroll Admin",
  accounting: "Accounting",
  cfo: "CFO",
  os5_admin: "Admin",
};

type PerspectiveSwitcherProps = {
  activeRole: AppRole | null;
};

export function PerspectiveSwitcher({ activeRole }: PerspectiveSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changePerspective(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("perspective", value);
    } else {
      params.delete("perspective");
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <label className="perspective-switcher">
      <span>View as</span>
      <select value={activeRole ?? ""} onChange={(event) => changePerspective(event.currentTarget.value)}>
        <option value="">My access</option>
        {appRoles.map((role) => (
          <option key={role} value={role}>
            {roleLabels[role]}
          </option>
        ))}
      </select>
    </label>
  );
}
