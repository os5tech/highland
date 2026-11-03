"use client";

import { useMemo, useState } from "react";

type ReviewStatus = "Pending" | "Approved" | "Corrected" | "Rejected";

type TimeEntry = {
  id: string;
  date: string;
  employeeId: string;
  job: string;
  bucket: string;
  costCode: string;
  hours: string;
  notes: string;
  status: ReviewStatus;
};

const employees = [
  { id: "maya", name: "Maya Alvarez", role: "Field Crew", pendingEntries: 4, submittedHours: "38.5" },
  { id: "ben", name: "Ben Carter", role: "Operator", pendingEntries: 3, submittedHours: "32.0" },
  { id: "lena", name: "Lena Brooks", role: "Foreman", pendingEntries: 2, submittedHours: "41.0" },
  { id: "oscar", name: "Oscar Ruiz", role: "Laborer", pendingEntries: 1, submittedHours: "18.5" },
];

const initialEntries: TimeEntry[] = [
  {
    id: "te-101",
    date: "Aug 3",
    employeeId: "maya",
    job: "Highland Yard Expansion",
    bucket: "Project Labor",
    costCode: "03-110 Concrete",
    hours: "8.0",
    notes: "Forming and pour prep.",
    status: "Pending",
  },
  {
    id: "te-102",
    date: "Aug 4",
    employeeId: "maya",
    job: "Highland Yard Expansion",
    bucket: "General Conditions",
    costCode: "00-210 Site supervision",
    hours: "9.5",
    notes: "Stayed late for delivery coordination.",
    status: "Pending",
  },
  {
    id: "te-103",
    date: "Aug 5",
    employeeId: "maya",
    job: "North Lot Drainage",
    bucket: "Project Labor",
    costCode: "31-220 Earthwork",
    hours: "7.0",
    notes: "Crew support and cleanup.",
    status: "Pending",
  },
  {
    id: "te-201",
    date: "Aug 4",
    employeeId: "ben",
    job: "North Lot Drainage",
    bucket: "Project Labor",
    costCode: "31-220 Earthwork",
    hours: "10.0",
    notes: "Excavator and trench box setup.",
    status: "Pending",
  },
  {
    id: "te-202",
    date: "Aug 5",
    employeeId: "ben",
    job: "North Lot Drainage",
    bucket: "Project Labor",
    costCode: "31-230 Backfill",
    hours: "8.0",
    notes: "Backfill and compaction.",
    status: "Pending",
  },
  {
    id: "te-301",
    date: "Aug 6",
    employeeId: "lena",
    job: "Maple Service Building",
    bucket: "Project Labor",
    costCode: "06-120 Framing",
    hours: "8.5",
    notes: "Layout review and crew direction.",
    status: "Pending",
  },
  {
    id: "te-401",
    date: "Aug 7",
    employeeId: "oscar",
    job: "Shop Maintenance",
    bucket: "GA",
    costCode: "90-100 Shop labor",
    hours: "6.5",
    notes: "Equipment cleanup.",
    status: "Pending",
  },
];

export function ProjectManagerDashboard() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0].id);
  const [entries, setEntries] = useState(initialEntries);
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) ?? employees[0];
  const selectedEntries = entries.filter((entry) => entry.employeeId === selectedEmployee.id);
  const pendingEntries = entries.filter((entry) => entry.status === "Pending");
  const approvedHours = entries
    .filter((entry) => entry.status === "Approved" || entry.status === "Corrected")
    .reduce((total, entry) => total + Number(entry.hours), 0);
  const employeeStats = useMemo(
    () =>
      employees.map((employee) => {
        const employeeEntries = entries.filter((entry) => entry.employeeId === employee.id);
        const submittedHours = employeeEntries.reduce((total, entry) => total + Number(entry.hours), 0);
        const pendingCount = employeeEntries.filter((entry) => entry.status === "Pending").length;

        return {
          ...employee,
          pendingCount,
          submittedHours: submittedHours.toFixed(1),
        };
      }),
    [entries],
  );
  const selectedEmployeeStats = employeeStats.find((employee) => employee.id === selectedEmployee.id) ?? employeeStats[0];

  const reviewCards = useMemo(
    () => [
      {
        label: "Employees To Review",
        value: String(employeeStats.filter((employee) => employee.pendingCount > 0).length),
        detail: "Field employees with time waiting for project manager approval.",
      },
      {
        label: "Pending Entries",
        value: String(pendingEntries.length),
        detail: "Individual time lines still waiting for approve, correct, or reject.",
      },
      {
        label: "Approved Hours",
        value: approvedHours.toFixed(1),
        detail: "Hours approved or corrected in this local review session.",
      },
      {
        label: "Open Exceptions",
        value: String(entries.filter((entry) => entry.status === "Rejected").length),
        detail: "Rejected entries that need employee follow-up before payroll readiness.",
      },
    ],
    [approvedHours, employeeStats, entries, pendingEntries.length],
  );

  function updateEntry(entryId: string, changes: Partial<TimeEntry>) {
    setEntries((currentEntries) =>
      currentEntries.map((entry) => (entry.id === entryId ? { ...entry, ...changes } : entry)),
    );
  }

  function setStatus(entryId: string, status: ReviewStatus) {
    updateEntry(entryId, { status });
  }

  return (
    <>
      <section className="metrics pm-review-metrics" aria-label="Project manager review status">
        {reviewCards.map((card) => (
          <article className="card metric-card" key={card.label}>
            <h2>{card.label}</h2>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel pm-review-panel" id="pm-approval">
        <div className="pm-review-hero">
          <div>
            <p className="eyebrow">Step 3</p>
            <h2>Review Field Time</h2>
            <p>Approve clean entries, correct coding mistakes, or send rejected time back with a clear employee-facing reason.</p>
          </div>
          <span>{pendingEntries.length} pending</span>
        </div>

        <div className="pm-review-layout">
          <aside className="pm-employee-list" aria-label="Field employees">
            <div className="pm-list-heading">
              <span>Employee Queue</span>
              <p>Current pay period</p>
            </div>
            {employeeStats.map((employee) => {
              const isSelected = employee.id === selectedEmployee.id;

              return (
                <button
                  aria-pressed={isSelected}
                  className={isSelected ? "pm-employee-button is-selected" : "pm-employee-button"}
                  key={employee.id}
                  onClick={() => setSelectedEmployeeId(employee.id)}
                  type="button"
                >
                  <span>
                    <b>{employee.name}</b>
                    <small>{employee.pendingCount} pending</small>
                  </span>
                  <strong>{employee.submittedHours}h</strong>
                </button>
              );
            })}
          </aside>

          <div className="pm-entry-workspace">
            <div className="pm-entry-heading">
              <div>
                <h3>{selectedEmployee.name}</h3>
                <p>{selectedEmployeeStats.submittedHours} submitted hours in this pay period.</p>
              </div>
              <span>{selectedEntries.filter((entry) => entry.status === "Pending").length} pending</span>
            </div>

            <div className="pm-entry-list">
              {selectedEntries.map((entry) => (
                <article className="pm-entry-card" key={entry.id}>
                  <div className="pm-entry-topline">
                    <time>{entry.date}</time>
                    <div>
                      <h4>{entry.job}</h4>
                      <p>{entry.bucket}</p>
                    </div>
                    <span className={`pm-status pm-status-${entry.status.toLowerCase()}`}>{entry.status}</span>
                  </div>

                  <div className="pm-entry-fields">
                    <label>
                      Hours
                      <input
                        inputMode="decimal"
                        onChange={(event) => updateEntry(entry.id, { hours: event.target.value })}
                        value={entry.hours}
                      />
                    </label>
                    <label>
                      Cost code
                      <input
                        onChange={(event) => updateEntry(entry.id, { costCode: event.target.value })}
                        value={entry.costCode}
                      />
                    </label>
                    <label>
                      Job bucket
                      <select
                        onChange={(event) => updateEntry(entry.id, { bucket: event.target.value })}
                        value={entry.bucket}
                      >
                        <option>Project Labor</option>
                        <option>General Conditions</option>
                        <option>GA</option>
                        <option>Business Development</option>
                      </select>
                    </label>
                    <label>
                      Employee note
                      <input
                        onChange={(event) => updateEntry(entry.id, { notes: event.target.value })}
                        value={entry.notes}
                      />
                    </label>
                    <label className="pm-decision-note">
                      Change or rejection reason sent to employee
                      <textarea
                        onChange={(event) =>
                          setDecisionNotes((currentNotes) => ({
                            ...currentNotes,
                            [entry.id]: event.target.value,
                          }))
                        }
                        placeholder="Example: Moved 1.5 hours from Project Labor to General Conditions because the work was delivery coordination."
                        value={decisionNotes[entry.id] ?? ""}
                      />
                    </label>
                  </div>

                  <div className="pm-entry-actions">
                    <p>Employee is notified when a correction or rejection is saved.</p>
                    <button className="pm-approve-button" onClick={() => setStatus(entry.id, "Approved")} type="button">
                      Approve
                    </button>
                    <button className="pm-correct-button" onClick={() => setStatus(entry.id, "Corrected")} type="button">
                      Save correction
                    </button>
                    <button className="pm-reject-button" onClick={() => setStatus(entry.id, "Rejected")} type="button">
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
