import { ConflictError, NotFoundError } from "@/server/errors";
import { pricingRuleRepository } from "@/server/repositories/pricing-rule.repository";
import { propertyRepository } from "@/server/repositories/property.repository";
import { requireDatabase } from "@/server/lib/require-config";
import { rupeesToPaise } from "@/server/lib/money";
import { rangesOverlap } from "@/server/lib/dates";

async function assertNoOverlap(input: {
  propertyId: string;
  startDate: string;
  endDate: string;
  excludeId?: string;
}) {
  const existing = await pricingRuleRepository.listForProperty(input.propertyId);
  for (const rule of existing) {
    if (rule.id === input.excludeId || !rule.isActive) continue;
    const start = rule.startDate.toISOString().slice(0, 10);
    const end = rule.endDate.toISOString().slice(0, 10);
    if (rangesOverlap(input.startDate, input.endDate, start, end)) {
      throw new ConflictError("This date range overlaps an existing pricing rule");
    }
  }
}

export async function listPricingRulesForProperty(propertyId: string) {
  requireDatabase();
  const rules = await pricingRuleRepository.listForProperty(propertyId);
  return rules.map(pricingRuleRepository.toDto);
}

export async function createPricingRule(input: {
  actorId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  nightlyPriceRupees: number;
  weekendPriceRupees?: number;
}) {
  requireDatabase();
  const property = await propertyRepository.findById(input.propertyId);
  if (!property) throw new NotFoundError("Property not found");

  await assertNoOverlap({
    propertyId: input.propertyId,
    startDate: input.startDate,
    endDate: input.endDate,
  });

  const rule = await pricingRuleRepository.create({
    propertyId: input.propertyId,
    startDate: input.startDate,
    endDate: input.endDate,
    nightlyPricePaise: rupeesToPaise(input.nightlyPriceRupees),
    weekendPricePaise:
      input.weekendPriceRupees != null ? rupeesToPaise(input.weekendPriceRupees) : null,
  });


  return rule;
}

export async function updatePricingRule(input: {
  actorId: string;
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  nightlyPriceRupees: number;
  weekendPriceRupees?: number;
  isActive?: boolean;
}) {
  requireDatabase();
  const existing = await pricingRuleRepository.findById(input.id);
  if (!existing || existing.propertyId !== input.propertyId) {
    throw new NotFoundError("Pricing rule not found");
  }

  await assertNoOverlap({
    propertyId: input.propertyId,
    startDate: input.startDate,
    endDate: input.endDate,
    excludeId: input.id,
  });

  const rule = await pricingRuleRepository.update(input.id, {
    startDate: input.startDate,
    endDate: input.endDate,
    nightlyPricePaise: rupeesToPaise(input.nightlyPriceRupees),
    weekendPricePaise:
      input.weekendPriceRupees != null ? rupeesToPaise(input.weekendPriceRupees) : null,
    isActive: input.isActive,
  });


  return rule;
}

export async function deletePricingRule(input: {
  actorId: string;
  id: string;
  propertyId: string;
}) {
  requireDatabase();
  const existing = await pricingRuleRepository.findById(input.id);
  if (!existing || existing.propertyId !== input.propertyId) {
    throw new NotFoundError("Pricing rule not found");
  }

  await pricingRuleRepository.delete(input.id);

}

export async function togglePricingRule(input: {
  actorId: string;
  id: string;
  propertyId: string;
  isActive: boolean;
}) {
  requireDatabase();
  const existing = await pricingRuleRepository.findById(input.id);
  if (!existing || existing.propertyId !== input.propertyId) {
    throw new NotFoundError("Pricing rule not found");
  }

  if (input.isActive) {
    await assertNoOverlap({
      propertyId: input.propertyId,
      startDate: existing.startDate.toISOString().slice(0, 10),
      endDate: existing.endDate.toISOString().slice(0, 10),
      excludeId: input.id,
    });
  }

  const rule = await pricingRuleRepository.update(input.id, { isActive: input.isActive });


  return rule;
}

export async function getActivePricingRulesForStay(
  propertyId: string,
  checkIn: string,
  checkOut: string,
) {
  requireDatabase();
  const rules = await pricingRuleRepository.listActiveForStay(propertyId, checkIn, checkOut);
  return rules.map((rule) => ({
    startDate: rule.startDate.toISOString().slice(0, 10),
    endDate: rule.endDate.toISOString().slice(0, 10),
    nightlyPricePaise: rule.nightlyPricePaise,
    weekendPricePaise: rule.weekendPricePaise,
  }));
}
