"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createPricingRuleAction,
  deletePricingRuleAction,
  togglePricingRuleAction,
} from "@/app/actions/pricing.actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { paiseToRupees } from "@/server/lib/money";

export type PricingRuleRow = {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  nightlyPricePaise: number;
  weekendPricePaise: number | null;
  isActive: boolean;
};

export function PricingRulesClient({
  propertyId,
  rules: initialRules,
}: {
  propertyId: string;
  rules: PricingRuleRow[];
}) {
  const [rules, setRules] = useState(initialRules);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  async function handleCreate(formData: FormData) {
    setSaving(true);
    const result = await createPricingRuleAction(formData);
    setSaving(false);
    if (result.ok) {
      showToast("Pricing rule added", "success");
      setOpen(false);
      router.refresh();
    } else {
      showToast(result.error, "error");
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg">Seasonal pricing</h2>
          <p className="mt-1 text-sm text-muted">
            Override nightly rates for specific date ranges. Overlapping active rules are not allowed.
          </p>
        </div>
        <Button type="button" size="sm" onClick={() => setOpen(true)}>
          Add rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No seasonal pricing rules yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-2 pr-4 font-medium">Dates</th>
                <th className="py-2 pr-4 font-medium">Nightly</th>
                <th className="py-2 pr-4 font-medium">Weekend</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4">
                    {rule.startDate} → {rule.endDate}
                  </td>
                  <td className="py-3 pr-4">{formatCurrency(paiseToRupees(rule.nightlyPricePaise))}</td>
                  <td className="py-3 pr-4">
                    {rule.weekendPricePaise != null
                      ? formatCurrency(paiseToRupees(rule.weekendPricePaise))
                      : "Same as nightly"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={rule.isActive ? "text-success" : "text-muted"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const result = await togglePricingRuleAction({
                            id: rule.id,
                            propertyId,
                            isActive: !rule.isActive,
                          });
                          if (result.ok) {
                            setRules((prev) =>
                              prev.map((r) =>
                                r.id === rule.id ? { ...r, isActive: !r.isActive } : r,
                              ),
                            );
                            showToast(rule.isActive ? "Rule deactivated" : "Rule activated", "info");
                            router.refresh();
                          } else {
                            showToast(result.error, "error");
                          }
                        }}
                      >
                        {rule.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-error"
                        onClick={async () => {
                          if (!confirm("Delete this pricing rule?")) return;
                          const result = await deletePricingRuleAction({ id: rule.id, propertyId });
                          if (result.ok) {
                            setRules((prev) => prev.filter((r) => r.id !== rule.id));
                            showToast("Rule deleted", "info");
                            router.refresh();
                          } else {
                            showToast(result.error, "error");
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add pricing rule">
        <form action={handleCreate} className="space-y-4">
          <input type="hidden" name="propertyId" value={propertyId} />
          <Input label="Start date" name="startDate" type="date" required />
          <Input label="End date" name="endDate" type="date" required />
          <Input label="Nightly price (₹)" name="nightlyPriceRupees" type="number" min={0} required />
          <Input
            label="Weekend price (₹, optional)"
            name="weekendPriceRupees"
            type="number"
            min={0}
            placeholder="Same as nightly"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add rule"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
