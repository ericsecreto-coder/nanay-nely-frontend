"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { upsertProfileAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/password-input";
import { useToast } from "@/components/ui/toast-provider";
import type { UserRole } from "@/lib/types/database";

type Props = {
  initialMode?: "login" | "register";
};

export function AuthUI({ initialMode = "login" }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      showToast(loginError.message, "error");
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

    if (role === "admin") {
      showToast("Welcome back, Admin!", "success");
      router.push("/admin");
      router.refresh();
      return;
    }

    showToast("Logged in successfully.", "success");
    const destination = redirectTo.startsWith("/admin") ? "/dashboard" : redirectTo;
    router.push(destination);
    router.refresh();
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

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
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo
      }
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      showToast(signUpError.message, "error");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const profileResult = await upsertProfileAction({ fullName: fullName.trim() });
      if (profileResult.error) {
        showToast(profileResult.error, "error");
      }
    }

    const successMsg = user
      ? "Account created! You are now logged in."
      : "Registration successful. Check your email to confirm your account, then log in.";

    showToast(successMsg, "success");
    setMessage(successMsg);

    if (user) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setMode("login");
  }

  return (
    <div className="auth-wrap page">
      <section className="auth-visual">
        <div>
          <img
            className="auth-visual-img"
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=700&q=80"
            alt="Nanay Nely visual"
          />
          <div style={{ textAlign: "center" }}>
            <h2 className="section-title" style={{ marginBottom: "0.25rem" }}>
              Welcome Back
            </h2>
            <p style={{ color: "var(--leaf)", fontStyle: "italic" }}>&quot;Basta masarap, ibabalik mo.&quot;</p>
          </div>
        </div>
      </section>

      <section className="auth-form-col">
        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2 className="auth-h">Your Account</h2>
            <p style={{ color: "var(--w55)", marginBottom: "1.25rem" }}>Login to access your customer dashboard</p>
            <AuthTabs mode={mode} onModeChange={setMode} />

            <div className="fg">
              <label className="fl" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="fi"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="login-password">
                Password
              </label>
              <PasswordInput
                id="login-password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="auth-forgot-row">
              <Link href="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            {error && <p className="auth-alert auth-alert-error">{error}</p>}
            {message && <p className="auth-alert auth-alert-success">{message}</p>}

            <button type="submit" className="btn btn-amber" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <h2 className="auth-h">Create Account</h2>
            <p style={{ color: "var(--w55)", marginBottom: "1.25rem" }}>Register as a customer to place orders</p>
            <AuthTabs mode={mode} onModeChange={setMode} />

            <div className="fg">
              <label className="fl" htmlFor="register-name">
                Full Name
              </label>
              <input
                id="register-name"
                className="fi"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                required
                autoComplete="name"
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                className="fi"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="register-password">
                Password
              </label>
              <PasswordInput
                id="register-password"
                value={password}
                onChange={setPassword}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <PasswordInput
                id="register-confirm-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>

            {error && <p className="auth-alert auth-alert-error">{error}</p>}
            {message && <p className="auth-alert auth-alert-success">{message}</p>}

            <button type="submit" className="btn btn-amber" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function AuthTabs({
  mode,
  onModeChange
}: {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}) {
  return (
    <div className="auth-tabs">
      <button type="button" className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => onModeChange("login")}>
        Login
      </button>
      <button
        type="button"
        className={`auth-tab ${mode === "register" ? "active" : ""}`}
        onClick={() => onModeChange("register")}
      >
        Register
      </button>
    </div>
  );
}
