import { env, isDatabaseConfigured } from "@/lib/env";
import { getHostSettings } from "@/server/services/notification.service";
import { getCalendarSettings } from "@/server/services/calendar-sync.service";
import { SettingsPageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminSettingsClient } from "./settings-client";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  if (!isDatabaseConfigured) {
    return <SettingsPageSkeleton />;
  }

  const [hostSettings, calendar] = await Promise.all([
    getHostSettings(),
    getCalendarSettings(env.APP_URL),
  ]);
  return <AdminSettingsClient hostSettings={hostSettings} calendar={calendar} />;
}
