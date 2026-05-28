"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/password-input";
import type { UserRole } from "@/lib/types/database";

export function AdminAuthUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("Unable to verify account.");
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const role = profile?.role as UserRole | undefined;

    setLoading(false);

    if (role !== "admin") {
      await supabase.auth.signOut();
      setError("Access denied. This login is for administrators only.");
      return;
    }

    router.push(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
    router.refresh();
  }

  return (
    <main className="page">
      <section className="sec admin-login-wrap">
        <div className="glass-card admin-login-card">
          <span className="section-tag">Admin Portal</span>
          <h1 className="section-title">Administrator Login</h1>
          <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
            Sign in with an admin account to manage products and store settings.
          </p>

          <form onSubmit={handleLogin}>
            <div className="fg">
              <label className="fl" htmlFor="admin-email">
                Admin Email
              </label>
              <input
                id="admin-email"
                className="fi"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="admin-password">
                Password
              </label>
              <PasswordInput
                id="admin-password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="auth-alert auth-alert-error">{error}</p>}

            <button type="submit" className="btn btn-amber" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign in as Admin"}
            </button>
          </form>

          <p style={{ marginTop: "1rem", fontSize: "0.86rem" }}>
            <Link href="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.86rem", color: "var(--w55)" }}>
            Customer? <Link href="/login" className="auth-link">Go to customer login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
