import { describe, expect, it } from "vitest";
import { quoteStay } from "@/server/services/pricing.service";
import { paiseToRupees, rupeesToPaise } from "@/server/lib/money";
import { nightsBetween, rangesOverlap } from "@/server/lib/dates";

describe("pricing.service", () => {
  const property = {
    name: "Test Stay",
    basePricePaise: rupeesToPaise(4000),
    weekendPricePaise: rupeesToPaise(5000),
    cleaningFeePaise: rupeesToPaise(800),
  };

  it("uses integer paise and zero tax/service by default", () => {
    const quote = quoteStay({
      property,
      checkIn: "2026-09-14",
      checkOut: "2026-09-16",
      guests: 2,
    });
    expect(quote.nights).toBe(2);
    expect(quote.serviceFeeRupees).toBe(0);
    expect(quote.taxRupees).toBe(0);
    expect(quote.cleaningFeeRupees).toBe(800);
    expect(Number.isInteger(quote.snapshot.totalPaise)).toBe(true);
    expect(paiseToRupees(quote.snapshot.totalPaise)).toBe(quote.totalRupees);
  });

  it("applies weekend rate on Saturday and Sunday nights", () => {
    const quote = quoteStay({
      property,
      checkIn: "2026-09-18",
      checkOut: "2026-09-21",
      guests: 2,
    });
    expect(quote.nights).toBe(3);
    expect(quote.accommodationRupees).toBe(4000 + 5000 + 5000);
    expect(quote.totalRupees).toBe(4000 + 5000 + 5000 + 800);
  });

  it("applies seasonal pricing rules over base rates", () => {
    const quote = quoteStay({
      property,
      checkIn: "2026-12-20",
      checkOut: "2026-12-23",
      guests: 2,
      rules: [
        {
          startDate: "2026-12-20",
          endDate: "2026-12-22",
          nightlyPricePaise: rupeesToPaise(8000),
          weekendPricePaise: rupeesToPaise(9000),
        },
      ],
    });
    expect(quote.nights).toBe(3);
    expect(quote.accommodationRupees).toBe(8000 + 9000 + 8000);
  });
});

describe("dates", () => {
  it("counts exclusive checkout nights", () => {
    expect(nightsBetween("2026-09-15", "2026-09-18")).toBe(3);
  });

  it("detects overlapping ranges", () => {
    expect(rangesOverlap("2026-09-15", "2026-09-18", "2026-09-17", "2026-09-20")).toBe(true);
    expect(rangesOverlap("2026-09-15", "2026-09-18", "2026-09-18", "2026-09-20")).toBe(false);
  });
});
