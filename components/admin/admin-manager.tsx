"use client";

import { useState, useTransition } from "react";
import { promoteToAdminAction, demoteToCustomerAction } from "@/app/actions/admin";
import { useToast } from "@/components/ui/toast-provider";

type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in: string | null;
};

type Props = {
  profiles: AdminProfile[];
};

export function AdminManager({ profiles }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(profiles);

  function handlePromote(userId: string) {
    startTransition(async () => {
      const result = await promoteToAdminAction(userId);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("User promoted to admin.", "success");
      setItems((prev) => prev.map((p) => (p.id === userId ? { ...p, role: "admin" } : p)));
    });
  }

  function handleDemote(userId: string) {
    startTransition(async () => {
      const result = await demoteToCustomerAction(userId);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast("Admin demoted to customer.", "success");
      setItems((prev) => prev.map((p) => (p.id === userId ? { ...p, role: "customer" } : p)));
    });
  }

  const admins = items.filter((p) => p.role === "admin");
  const customers = items.filter((p) => p.role === "customer");

  return (
    <div className="admin-products-layout">
      <section className="dc">
        <h2 className="dc-title">Current Admins ({admins.length})</h2>
        {admins.length === 0 ? (
          <p style={{ color: "var(--w55)", textAlign: "center", padding: "1rem" }}>No admin accounts yet.</p>
        ) : (
          <table className="ot">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td><strong>{admin.full_name || "—"}</strong></td>
                  <td>{admin.email}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleDemote(admin.id)}
                      disabled={isPending}
                    >
                      Remove Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="dc">
        <h2 className="dc-title">Customers ({customers.length})</h2>
        {customers.length === 0 ? (
          <p style={{ color: "var(--w55)", textAlign: "center", padding: "1rem" }}>No registered customers yet.</p>
        ) : (
          <table className="ot">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td><strong>{customer.full_name || "—"}</strong></td>
                  <td>{customer.email}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-amber"
                      onClick={() => handlePromote(customer.id)}
                      disabled={isPending}
                    >
                      Promote to Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
