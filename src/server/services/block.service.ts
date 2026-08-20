import type { BlockReason } from "@prisma/client";
import { NotFoundError, ValidationError } from "@/server/errors";
import { formatDateOnly, isDateOnly, nightsBetween, parseDateOnly } from "@/server/lib/dates";
import { requireDatabase } from "@/server/lib/require-config";
import { blockRepository } from "@/server/repositories/block.repository";
import { propertyRepository } from "@/server/repositories/property.repository";

export async function listPropertyBlocks(propertyId: string) {
  requireDatabase();
  const blocks = await blockRepository.listForProperty(propertyId);
  return blocks.map((block) => ({
    id: block.id,
    propertyId: block.propertyId,
    start: formatDateOnly(block.startDate),
    end: formatDateOnly(block.endDate),
    reason: block.reason,
    notes: block.notes,
    title: "Blocked",
    type: "blocked" as const,
  }));
}

export async function createPropertyBlock(input: {
  actorId: string;
  propertyId: string;
  start: string;
  end: string;
  reason: BlockReason;
  notes?: string;
}) {
  requireDatabase();
  if (!isDateOnly(input.start) || !isDateOnly(input.end)) {
    throw new ValidationError("Dates must be YYYY-MM-DD");
  }
  if (nightsBetween(input.start, input.end) < 1) {
    throw new ValidationError("End date must be after start date");
  }
  const property = await propertyRepository.findById(input.propertyId);
  if (!property) throw new NotFoundError("Property not found");

  const block = await blockRepository.create({
    property: { connect: { id: input.propertyId } },
    startDate: parseDateOnly(input.start),
    endDate: parseDateOnly(input.end),
    reason: input.reason,
    notes: input.notes,
    createdBy: { connect: { id: input.actorId } },
  });


  return block;
}

export async function deletePropertyBlock(input: {
  actorId: string;
  blockId: string;
}) {
  requireDatabase();
  const block = await blockRepository.findById(input.blockId);
  if (!block) throw new NotFoundError("Block not found");
  if (block.source !== "MANUAL") {
    throw new ValidationError("Only manual blocks can be removed from the calendar");
  }

  await blockRepository.delete(input.blockId);

}
