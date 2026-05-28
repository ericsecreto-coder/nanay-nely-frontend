import { ResetPasswordForm } from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="page">
      <section className="sec" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="section-title">Reset Password</h1>
        <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
          Enter your new password below.
        </p>
        <div className="glass-card">
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}
