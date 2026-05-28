"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast-provider";

type Props = {
  className?: string;
  label?: string;
};

export function LogoutButton({ className = "btn btn-ghost", label = "Logout" }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    showToast("Logged out successfully.", "info");
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className={className} onClick={handleLogout}>
      {label}
    </button>
  );
}
