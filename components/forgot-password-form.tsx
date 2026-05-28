"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Check your email for a password reset link.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="fg">
        <label className="fl" htmlFor="forgot-email">
          Email
        </label>
        <input
          id="forgot-email"
          className="fi"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          autoComplete="email"
        />
      </div>
      {error && <p className="auth-alert auth-alert-error">{error}</p>}
      {message && <p className="auth-alert auth-alert-success">{message}</p>}
      <button type="submit" className="btn btn-amber" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
