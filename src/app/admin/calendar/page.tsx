import { listCalendarEvents } from "@/server/services/calendar-events.service";
import { listAllPropertiesForAdmin } from "@/server/services/property.service";
import { CalendarPageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminCalendarClient } from "./calendar-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Calendar" };

export default async function AdminCalendarPage() {
  if (!isDatabaseConfigured) {
    return <CalendarPageSkeleton />;
  }

  const [events, properties] = await Promise.all([
    listCalendarEvents(),
    listAllPropertiesForAdmin(),
  ]);

  return <AdminCalendarClient events={events} properties={properties} />;
}
