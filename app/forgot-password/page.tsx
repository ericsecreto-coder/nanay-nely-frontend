import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="page">
      <section className="sec" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="section-title">Forgot Password</h1>
        <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
          Enter your email and we&apos;ll send you a password reset link.
        </p>
        <div className="glass-card">
          <ForgotPasswordForm />
        </div>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/login" style={{ color: "var(--honey)" }}>
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
