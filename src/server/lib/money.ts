export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise / 100);
}

export function assertPaise(value: number, label = "amount"): number {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer number of paise`);
  }
  if (value < 0) {
    throw new Error(`${label} cannot be negative`);
  }
  return value;
}
