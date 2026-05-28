import { Suspense } from "react";
import { AuthUI } from "@/components/auth-ui";

export default function AuthPage() {
  return (
    <Suspense fallback={<main className="page" />}>
      <AuthUI initialMode="login" />
    </Suspense>
  );
}
