export const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const isClerkConfigured = Boolean(clerkPublishableKey);

export const clerkAppearance = {
  variables: {
    colorPrimary: "#a67c52",
    colorText: "#1c1917",
    colorTextSecondary: "#78716c",
    colorBackground: "#ffffff",
    colorInputBackground: "#fdfcf9",
    colorInputText: "#1c1917",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
  },
  elements: {
    rootBox: "mx-auto w-full",
    card: "shadow-soft border border-border rounded-xl",
    headerTitle: "font-serif text-2xl",
    headerSubtitle: "text-muted text-sm",
    formButtonPrimary:
      "bg-foreground hover:bg-foreground/90 text-background rounded-lg text-sm font-medium",
    footerActionLink: "text-accent hover:text-accent/80",
    formFieldInput: "rounded-lg border-border bg-background",
    socialButtonsBlockButton:
      "rounded-lg border border-border bg-surface hover:bg-background",
  },
};

export const clerkSignInUrl = "/sign-in";
export const clerkSignUpUrl = "/sign-up";
export const clerkAfterSignInUrl = "/bookings";
export const clerkAfterSignUpUrl = "/bookings";
