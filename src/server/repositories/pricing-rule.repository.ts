import prisma from "@/lib/prisma";
import type { PricingRule } from "@prisma/client";

export type PricingRuleDto = {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  nightlyPricePaise: number;
  weekendPricePaise: number | null;
  isActive: boolean;
};

function toDto(rule: PricingRule): PricingRuleDto {
  return {
    id: rule.id,
    propertyId: rule.propertyId,
    startDate: rule.startDate.toISOString().slice(0, 10),
    endDate: rule.endDate.toISOString().slice(0, 10),
    nightlyPricePaise: rule.nightlyPricePaise,
    weekendPricePaise: rule.weekendPricePaise,
    isActive: rule.isActive,
  };
}

export const pricingRuleRepository = {
  listForProperty(propertyId: string) {
    return prisma.pricingRule.findMany({
      where: { propertyId },
      orderBy: { startDate: "asc" },
    });
  },

  listActiveForStay(propertyId: string, checkIn: string, checkOut: string) {
    const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
    const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);
    return prisma.pricingRule.findMany({
      where: {
        propertyId,
        isActive: true,
        startDate: { lte: checkOutDate },
        endDate: { gte: checkInDate },
      },
      orderBy: { startDate: "asc" },
    });
  },

  findById(id: string) {
    return prisma.pricingRule.findUnique({ where: { id } });
  },

  async create(input: {
    propertyId: string;
    startDate: string;
    endDate: string;
    nightlyPricePaise: number;
    weekendPricePaise?: number | null;
  }) {
    const rule = await prisma.pricingRule.create({
      data: {
        propertyId: input.propertyId,
        startDate: new Date(`${input.startDate}T00:00:00.000Z`),
        endDate: new Date(`${input.endDate}T00:00:00.000Z`),
        nightlyPricePaise: input.nightlyPricePaise,
        weekendPricePaise: input.weekendPricePaise ?? null,
      },
    });
    return toDto(rule);
  },

  async update(
    id: string,
    input: Partial<{
      startDate: string;
      endDate: string;
      nightlyPricePaise: number;
      weekendPricePaise: number | null;
      isActive: boolean;
    }>,
  ) {
    const rule = await prisma.pricingRule.update({
      where: { id },
      data: {
        startDate: input.startDate ? new Date(`${input.startDate}T00:00:00.000Z`) : undefined,
        endDate: input.endDate ? new Date(`${input.endDate}T00:00:00.000Z`) : undefined,
        nightlyPricePaise: input.nightlyPricePaise,
        weekendPricePaise: input.weekendPricePaise,
        isActive: input.isActive,
      },
    });
    return toDto(rule);
  },

  delete(id: string) {
    return prisma.pricingRule.delete({ where: { id } });
  },

  toDto,
};
