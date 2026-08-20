"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { confirmDirectPaymentAction, requestRefundAction } from "@/app/actions/payment.actions";

type PaymentRow = {
  id: string;
  paymentId: string | null;
  bookingId: string;
  guestName: string;
  propertyName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  refundable: boolean;
  providerPaymentId: string | null;
};

export function AdminPaymentsClient({ payments }: { payments: PaymentRow[] }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [refundId, setRefundId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const { showToast } = useToast();
  const router = useRouter();
  const selected = payments.find((p) => p.id === confirmId);
  const refundTarget = payments.find((p) => p.id === refundId);

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Payments</h1>
      <p className="mt-1 text-sm text-muted">{payments.length} transactions</p>

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
            {payments.map((p) => (
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
                  <div className="flex flex-wrap gap-2">
                    {p.status === "pending" && p.method === "direct" && (
                      <Button variant="ghost" size="sm" onClick={() => setConfirmId(p.id)}>
                        Mark received
                      </Button>
                    )}
                    {p.refundable && p.paymentId && (
                      <Button variant="ghost" size="sm" onClick={() => setRefundId(p.id)}>
                        Refund
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-3 lg:hidden">
        {payments.map((p) => (
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
              <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => setConfirmId(p.id)}>
                Mark payment received
              </Button>
            )}
            {p.refundable && p.paymentId && (
              <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => setRefundId(p.id)}>
                Issue refund
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Confirm payment received">
        <p className="text-sm text-muted">
          Confirm that direct payment has been received? This will confirm the booking and hold the dates.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            fullWidth
            onClick={async () => {
              if (!selected) return;
              const result = await confirmDirectPaymentAction(selected.bookingId);
              if (result.ok) {
                showToast("Payment marked as received", "success");
                setConfirmId(null);
                router.refresh();
              } else {
                showToast(result.error, "error");
              }
            }}
          >
            Confirm
          </Button>
          <Button variant="outline" fullWidth onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!refundId}
        onClose={() => {
          setRefundId(null);
          setRefundReason("");
        }}
        title="Issue refund"
      >
        <p className="text-sm text-muted">
          Refund the full amount of {refundTarget ? formatCurrency(refundTarget.amount) : ""} for booking #
          {refundTarget?.bookingId}?
        </p>
        <Textarea
          label="Reason (optional)"
          rows={3}
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          className="mt-4"
        />
        <div className="mt-6 flex gap-3">
          <Button
            fullWidth
            variant="outline"
            className="text-error"
            onClick={async () => {
              if (!refundTarget?.paymentId) return;
              const result = await requestRefundAction({
                paymentId: refundTarget.paymentId,
                reason: refundReason || undefined,
              });
              if (result.ok) {
                showToast("Refund initiated", "success");
                setRefundId(null);
                setRefundReason("");
                router.refresh();
              } else {
                showToast(result.error, "error");
              }
            }}
          >
            Confirm refund
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setRefundId(null);
              setRefundReason("");
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
