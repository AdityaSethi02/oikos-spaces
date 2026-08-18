"use client";

import { useState } from "react";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { adminPayments } from "@/data/mock/admin";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

export default function AdminPaymentsPage() {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Payments</h1>
      <p className="mt-1 text-sm text-muted">{adminPayments.length} transactions</p>

      <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border bg-surface lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {adminPayments.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">#{p.bookingId}</td>
                <td className="px-4 py-3">{p.guestName}</td>
                <td className="px-4 py-3">{p.propertyName}</td>
                <td className="px-4 py-3">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 capitalize">{p.method}</td>
                <td className="px-4 py-3">
                  <PaymentStatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3">{p.date}</td>
                <td className="px-4 py-3">
                  {p.status === "pending" && p.method === "direct" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmId(p.id)}
                    >
                      Mark received
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-3 lg:hidden">
        {adminPayments.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">#{p.bookingId}</p>
              <PaymentStatusBadge status={p.status} />
            </div>
            <p className="mt-2 text-sm">{p.guestName}</p>
            <p className="text-sm text-muted">{p.propertyName}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-medium">{formatCurrency(p.amount)}</span>
              <span className="text-sm capitalize text-muted">{p.method}</span>
            </div>
            {p.status === "pending" && p.method === "direct" && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="mt-3"
                onClick={() => setConfirmId(p.id)}
              >
                Mark payment received
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Confirm payment received"
      >
        <p className="text-sm text-muted">
          Confirm that direct payment has been received?
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            fullWidth
            onClick={() => {
              showToast("Payment marked as received (demo)", "success");
              setConfirmId(null);
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" fullWidth onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
