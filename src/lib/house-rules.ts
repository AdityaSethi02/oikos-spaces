export function buildHouseRules(input: {
  quietHours?: string;
  allowSmoking: boolean;
  allowPets: boolean;
  allowParties: boolean;
  customHouseRules?: string;
}): string[] {
  const rules: string[] = [];
  if (input.quietHours) {
    rules.push(`Quiet hours: ${input.quietHours}`);
  }
  rules.push(
    input.allowSmoking ? "Smoking allowed indoors" : "No smoking indoors",
    input.allowPets ? "Pets allowed" : "Pets not allowed",
    input.allowParties ? "Parties and events allowed" : "No parties or events",
  );
  if (input.customHouseRules) {
    input.customHouseRules
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => rules.push(line));
  }
  return rules;
}

export function parseHouseRulesMeta(rules: string[]): {
  quietHours: string;
  allowSmoking: boolean;
  allowPets: boolean;
  allowParties: boolean;
  customRules: string;
} {
  const known = new Set<string>();
  let quietHours = "10:00 PM – 8:00 AM";
  let allowSmoking = false;
  let allowPets = false;
  let allowParties = false;

  for (const rule of rules) {
    const lower = rule.toLowerCase();
    if (lower.startsWith("quiet hours:")) {
      quietHours = rule.replace(/^quiet hours:\s*/i, "").trim();
      known.add(rule);
    } else if (lower.includes("smoking allowed")) {
      allowSmoking = true;
      known.add(rule);
    } else if (lower.includes("no smoking")) {
      allowSmoking = false;
      known.add(rule);
    } else if (lower.includes("pets allowed")) {
      allowPets = true;
      known.add(rule);
    } else if (lower.includes("pets not allowed") || lower.includes("no pets")) {
      allowPets = false;
      known.add(rule);
    } else if (lower.includes("parties") && lower.includes("allowed")) {
      allowParties = true;
      known.add(rule);
    } else if (lower.includes("no parties")) {
      allowParties = false;
      known.add(rule);
    }
  }

  const customRules = rules.filter((rule) => !known.has(rule)).join("\n");
  return { quietHours, allowSmoking, allowPets, allowParties, customRules };
}
