"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/providers/toast-provider";
import {
  addAdminHostAction,
  deactivateAdminHostAction,
  reactivateAdminHostAction,
} from "@/app/actions/host.actions";

type HostRow = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export function AdminUsersClient({ hosts: initial }: { hosts: HostRow[] }) {
  const { showToast } = useToast();
  const [hosts, setHosts] = useState(initial);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/admin/hosts");
    if (res.ok) {
      const data = (await res.json()) as { hosts: HostRow[] };
      setHosts(data.hosts);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Team</h1>
      <p className="mt-1 text-sm text-muted">Admin/host accounts with dashboard access</p>

      <Card className="mt-8">
        <h2 className="font-serif text-lg">Add admin/host</h2>
        <p className="mt-1 text-sm text-muted">
          Adds their email to the allowlist. They receive ADMIN_HOST on next Clerk sign-in.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button
          className="mt-4"
          disabled={busy || !email}
          onClick={async () => {
            setBusy(true);
            const result = await addAdminHostAction({ email, name: name || undefined });
            setBusy(false);
            if (result.ok) {
              showToast("Admin/host added", "success");
              setEmail("");
              setName("");
              await refresh();
            } else showToast(result.error, "error");
          }}
        >
          Add admin/host
        </Button>
      </Card>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((host) => (
              <tr key={host.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{host.name}</td>
                <td className="px-4 py-3">{host.email}</td>
                <td className="px-4 py-3">
                  <span className={host.isActive ? "text-success" : "text-muted"}>
                    {host.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">{host.createdAt}</td>
                <td className="px-4 py-3">
                  {host.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const result = await deactivateAdminHostAction(host.id);
                        if (result.ok) {
                          showToast("Deactivated", "success");
                          await refresh();
                        } else showToast(result.error, "error");
                      }}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const result = await reactivateAdminHostAction(host.id);
                        if (result.ok) {
                          showToast("Reactivated", "success");
                          await refresh();
                        } else showToast(result.error, "error");
                      }}
                    >
                      Reactivate
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
