export type AuthSessionResponse = {
  authenticated: boolean;
  isAdminHost: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: "GUEST" | "ADMIN_HOST";
  } | null;
  warning?: string;
  error?: string;
};
