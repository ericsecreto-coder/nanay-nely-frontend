import { Suspense } from "react";
import { AuthUI } from "@/components/auth-ui";

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="page" />}>
      <AuthUI initialMode="register" />
    </Suspense>
  );
}
