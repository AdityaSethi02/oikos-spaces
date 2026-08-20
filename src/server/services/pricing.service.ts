import { assertPaise, paiseToRupees } from "@/server/lib/money";
import { eachNight, isWeekendUtc, nightsBetween } from "@/server/lib/dates";
import type { PricingSnapshot, QuoteDto } from "@/server/dto/public.dto";

export type PricingRuleOverlay = {
  startDate: string;
  endDate: string;
  nightlyPricePaise: number;
  weekendPricePaise: number | null;
};

export type PricedProperty = {
  name: string;
  basePricePaise: number;
  weekendPricePaise: number | null;
  cleaningFeePaise: number;
  serviceFeePaise?: number;
  taxRateBps?: number;
};

function ruleForNight(night: string, rules: PricingRuleOverlay[]): PricingRuleOverlay | undefined {
  return rules.find((rule) => night >= rule.startDate && night <= rule.endDate);
}

function priceForNight(
  night: string,
  property: PricedProperty,
  rules: PricingRuleOverlay[],
): number {
  const rule = ruleForNight(night, rules);
  if (rule) {
    const weekendRate = rule.weekendPricePaise ?? rule.nightlyPricePaise;
    return isWeekendUtc(night) ? weekendRate : rule.nightlyPricePaise;
  }
  const base = assertPaise(property.basePricePaise, "basePricePaise");
  const weekend = assertPaise(
    property.weekendPricePaise ?? property.basePricePaise,
    "weekendPricePaise",
  );
  return isWeekendUtc(night) ? weekend : base;
}

function serviceFeePaise(accommodationPaise: number, property: PricedProperty): number {
  if (property.serviceFeePaise != null && property.serviceFeePaise > 0) {
    return property.serviceFeePaise;
  }
  return 0;
}

function taxPaise(taxablePaise: number, property: PricedProperty): number {
  const bps = property.taxRateBps ?? 0;
  if (bps <= 0) return 0;
  return Math.round((taxablePaise * bps) / 10_000);
}

export function quoteStay(input: {
  property: PricedProperty;
  checkIn: string;
  checkOut: string;
  guests: number;
  rules?: PricingRuleOverlay[];
}): QuoteDto {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  if (nights < 1) {
    throw new Error("Check-out must be after check-in");
  }

  const cleaning = assertPaise(input.property.cleaningFeePaise, "cleaningFeePaise");
  const rules = input.rules ?? [];

  let weekdayPaise = 0;
  let weekendPaise = 0;

  for (const night of eachNight(input.checkIn, input.checkOut)) {
    const paise = priceForNight(night, input.property, rules);
    if (isWeekendUtc(night)) weekendPaise += paise;
    else weekdayPaise += paise;
  }

  const accommodationPaise = weekdayPaise + weekendPaise;
  const serviceFee = serviceFeePaise(accommodationPaise, input.property);
  const tax = taxPaise(accommodationPaise + cleaning + serviceFee, input.property);
  const totalPaise = accommodationPaise + cleaning + serviceFee + tax;

  const lineItems: PricingSnapshot["lineItems"] = [];
  if (weekdayPaise > 0) {
    lineItems.push({
      code: "NIGHTLY",
      label: "Weeknight accommodation",
      amountPaise: weekdayPaise,
    });
  }
  if (weekendPaise > 0) {
    lineItems.push({
      code: "WEEKEND",
      label: "Weekend accommodation",
      amountPaise: weekendPaise,
    });
  }
  lineItems.push({
    code: "CLEANING",
    label: "Cleaning fee",
    amountPaise: cleaning,
  });
  lineItems.push({
    code: "SERVICE",
    label: "Service fee",
    amountPaise: serviceFee,
  });
  lineItems.push({
    code: "TAX",
    label: "Taxes & charges",
    amountPaise: tax,
  });

  const snapshot: PricingSnapshot = {
    currency: "INR",
    nights,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    lineItems: lineItems.filter((item) => item.amountPaise > 0),
    accommodationPaise,
    cleaningFeePaise: cleaning,
    serviceFeePaise: serviceFee,
    taxPaise: tax,
    totalPaise,
    quotedAt: new Date().toISOString(),
  };

  return {
    nights,
    accommodationRupees: paiseToRupees(accommodationPaise),
    cleaningFeeRupees: paiseToRupees(cleaning),
    serviceFeeRupees: paiseToRupees(serviceFee),
    taxRupees: paiseToRupees(tax),
    totalRupees: paiseToRupees(totalPaise),
    averageNightlyRupees: paiseToRupees(Math.round(accommodationPaise / nights)),
    snapshot,
  };
}

export function snapshotToQuote(snapshot: PricingSnapshot): QuoteDto {
  return {
    nights: snapshot.nights,
    accommodationRupees: paiseToRupees(snapshot.accommodationPaise),
    cleaningFeeRupees: paiseToRupees(snapshot.cleaningFeePaise),
    serviceFeeRupees: paiseToRupees(snapshot.serviceFeePaise),
    taxRupees: paiseToRupees(snapshot.taxPaise),
    totalRupees: paiseToRupees(snapshot.totalPaise),
    averageNightlyRupees: paiseToRupees(
      Math.round(snapshot.accommodationPaise / Math.max(1, snapshot.nights)),
    ),
    snapshot,
  };
}

export function toPricedProperty(property: {
  name: string;
  basePricePaise: number;
  weekendPricePaise: number | null;
  cleaningFeePaise: number;
  serviceFeePaise?: number;
  taxRateBps?: number;
}): PricedProperty {
  return {
    name: property.name,
    basePricePaise: property.basePricePaise,
    weekendPricePaise: property.weekendPricePaise,
    cleaningFeePaise: property.cleaningFeePaise,
    serviceFeePaise: property.serviceFeePaise,
    taxRateBps: property.taxRateBps,
  };
}
