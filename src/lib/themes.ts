/**
 * Site color themes. Change ACTIVE_THEME_INDEX to switch the whole palette.
 * 0 = current teal theme · 1–4 = brand alternatives
 */
export const ACTIVE_THEME_INDEX = 0;

export type ThemeColors = {
  name: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  accent: string;
  accentForeground: string;
  accentLight: string;
  highlight: string;
  secondary: string;
  secondaryForeground: string;
  header: string;
  headerForeground: string;
  headerMuted: string;
  footer: string;
  footerForeground: string;
  footerMuted: string;
  footerBorder: string;
  heroOverlay: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  sale: string;
  rent: string;
  lease: string;
};

const sharedStatus = {
  success: "#15803D",
  warning: "#B45309",
  error: "#B91C1C",
  info: "#1D4ED8",
  rent: "#1D4ED8",
  lease: "#7C3AED",
} as const;

/** Theme 0 — current cool stone + lake teal */
const theme0: ThemeColors = {
  name: "Teal",
  background: "#F4F6F5",
  surface: "#FFFFFF",
  foreground: "#15202B",
  muted: "#5C6B73",
  mutedForeground: "#8A9AA3",
  border: "#D8E0E3",
  accent: "#0F6B5C",
  accentForeground: "#FFFFFF",
  accentLight: "#E6F3F0",
  highlight: "#0F6B5C",
  secondary: "#FFFFFF",
  secondaryForeground: "#15202B",
  header: "#F4F6F5",
  headerForeground: "#15202B",
  headerMuted: "#5C6B73",
  footer: "#FFFFFF",
  footerForeground: "#15202B",
  footerMuted: "#5C6B73",
  footerBorder: "#D8E0E3",
  heroOverlay: "#15202B",
  sale: "#0F6B5C",
  ...sharedStatus,
};

/** Theme 1 — Forest + ivory */
const theme1: ThemeColors = {
  name: "Forest",
  background: "#F5F1E8",
  surface: "#FFFCF7",
  foreground: "#282D29",
  muted: "#5C635E",
  mutedForeground: "#8A908B",
  border: "#E4DCC8",
  accent: "#173C32",
  accentForeground: "#F5F1E8",
  accentLight: "#E8E0C8",
  highlight: "#D0B783",
  secondary: "#EFE8D9",
  secondaryForeground: "#282D29",
  header: "#244F42",
  headerForeground: "#F5F1E8",
  headerMuted: "#D0B783",
  footer: "#173C32",
  footerForeground: "#F5F1E8",
  footerMuted: "#D0B783",
  footerBorder: "#244F42",
  heroOverlay: "#173C32",
  sale: "#173C32",
  ...sharedStatus,
};

/** Theme 2 — Midnight + copper */
const theme2: ThemeColors = {
  name: "Midnight",
  background: "#F2EDE5",
  surface: "#FFFBF7",
  foreground: "#353A40",
  muted: "#6B7178",
  mutedForeground: "#949AA1",
  border: "#E0D8CC",
  accent: "#B8754D",
  accentForeground: "#FFFFFF",
  accentLight: "#F3E4D8",
  highlight: "#B8754D",
  secondary: "#263F59",
  secondaryForeground: "#F2EDE5",
  header: "#14283F",
  headerForeground: "#F2EDE5",
  headerMuted: "#B8C4D1",
  footer: "#14283F",
  footerForeground: "#F2EDE5",
  footerMuted: "#B8C4D1",
  footerBorder: "#263F59",
  heroOverlay: "#14283F",
  sale: "#B8754D",
  ...sharedStatus,
};

/** Theme 3 — Terracotta + cream */
const theme3: ThemeColors = {
  name: "Terracotta",
  background: "#F7F3EC",
  surface: "#FFFCF8",
  foreground: "#39342F",
  muted: "#6E655C",
  mutedForeground: "#978E84",
  border: "#E5D9C8",
  accent: "#A65F43",
  accentForeground: "#F7F3EC",
  accentLight: "#F0E2D4",
  highlight: "#C68A67",
  secondary: "#E9D9C5",
  secondaryForeground: "#39342F",
  header: "#F7F3EC",
  headerForeground: "#39342F",
  headerMuted: "#6E655C",
  footer: "#E9D9C5",
  footerForeground: "#39342F",
  footerMuted: "#6E655C",
  footerBorder: "#D9C8B0",
  heroOverlay: "#39342F",
  sale: "#A65F43",
  ...sharedStatus,
};

/** Theme 4 — Obsidian + antique gold */
const theme4: ThemeColors = {
  name: "Obsidian",
  background: "#F2EFE7",
  surface: "#FFFCF7",
  foreground: "#171717",
  muted: "#5C5C5C",
  mutedForeground: "#8A8A8A",
  border: "#D7D0C3",
  accent: "#B69A63",
  accentForeground: "#171717",
  accentLight: "#EBE4D4",
  highlight: "#B69A63",
  secondary: "#E8E3D8",
  secondaryForeground: "#171717",
  header: "#171717",
  headerForeground: "#F2EFE7",
  headerMuted: "#D7D0C3",
  footer: "#171717",
  footerForeground: "#F2EFE7",
  footerMuted: "#D7D0C3",
  footerBorder: "#292929",
  heroOverlay: "#171717",
  sale: "#B69A63",
  ...sharedStatus,
};

export const themes: readonly ThemeColors[] = [
  theme0,
  theme1,
  theme2,
  theme3,
  theme4,
];

const index = Math.min(
  Math.max(0, ACTIVE_THEME_INDEX),
  themes.length - 1,
);

export const colors: ThemeColors = themes[index];

/** CSS custom properties applied on the document element */
export function themeToCssVars(theme: ThemeColors = colors): Record<string, string> {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--surface": theme.surface,
    "--muted": theme.muted,
    "--muted-foreground": theme.mutedForeground,
    "--border": theme.border,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--accent-light": theme.accentLight,
    "--highlight": theme.highlight,
    "--secondary": theme.secondary,
    "--secondary-foreground": theme.secondaryForeground,
    "--header": theme.header,
    "--header-foreground": theme.headerForeground,
    "--header-muted": theme.headerMuted,
    "--footer": theme.footer,
    "--footer-foreground": theme.footerForeground,
    "--footer-muted": theme.footerMuted,
    "--footer-border": theme.footerBorder,
    "--hero-overlay": theme.heroOverlay,
    "--success": theme.success,
    "--warning": theme.warning,
    "--error": theme.error,
    "--info": theme.info,
    "--sale": theme.sale,
    "--rent": theme.rent,
    "--lease": theme.lease,
    "--shadow-soft": `0 1px 2px 0 color-mix(in srgb, ${theme.foreground} 4%, transparent), 0 8px 24px -8px color-mix(in srgb, ${theme.foreground} 8%, transparent)`,
  };
}
