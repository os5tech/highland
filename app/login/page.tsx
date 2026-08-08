import { MicrosoftSignInButton } from "./MicrosoftSignInButton";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="brand login-brand">
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

        <p className="eyebrow">Secure Access</p>
        <h1>Sign in with Microsoft Entra ID</h1>
        <p className="lede">
          Use your Microsoft 365 account to access payroll readiness, PM approvals, job-cost allocation, and protected administration.
        </p>

        <MicrosoftSignInButton />

        <p className="login-note">
          Access is role-based. Payroll, accounting, CFO, and admin actions require assigned permissions and are logged.
        </p>
      </section>
    </main>
  );
}
