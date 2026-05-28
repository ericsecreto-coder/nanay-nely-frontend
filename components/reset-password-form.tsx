"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="fg">
        <label className="fl" htmlFor="new-password">
          New Password
        </label>
        <PasswordInput
          id="new-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="confirm-new-password">
          Confirm Password
        </label>
        <PasswordInput
          id="confirm-new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Re-enter password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      {error && <p className="auth-alert auth-alert-error">{error}</p>}
      <button type="submit" className="btn btn-amber" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
