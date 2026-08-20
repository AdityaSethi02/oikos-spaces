import { listAdminDocuments } from "@/server/services/document.service";
import { AdminTablePageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminDocumentsClient } from "./documents-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Documents" };

export default async function AdminDocumentsPage() {
  if (!isDatabaseConfigured) {
    return <AdminTablePageSkeleton />;
  }

  const documents = await listAdminDocuments();
  return <AdminDocumentsClient documents={documents} />;
}
