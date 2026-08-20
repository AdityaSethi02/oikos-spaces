"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { Icons } from "@/components/icons";
import { viewDocumentAction } from "@/app/actions/payment.actions";

type DocumentRow = {
  id: string;
  guestName: string;
  bookingId: string;
  documentType: string;
  fileName: string;
  uploadedAt: string;
  status: "pending_review" | "verified" | "rejected";
};

export function AdminDocumentsClient({ documents }: { documents: DocumentRow[] }) {
  const { showToast } = useToast();

  const statusVariant = {
    pending_review: "warning" as const,
    verified: "success" as const,
    rejected: "error" as const,
  };

  const view = async (id: string) => {
    const result = await viewDocumentAction(id);
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Documents</h1>
      <p className="mt-1 text-sm text-muted">
        Secure document management · Protected access
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-warning">
        <Icons.Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        Documents are stored securely and accessible only to authorized hosts.
      </div>

      <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border bg-surface md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">File</th>
              <th className="px-4 py-3 font-medium">Uploaded</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{doc.guestName}</td>
                <td className="px-4 py-3">#{doc.bookingId}</td>
                <td className="px-4 py-3">{doc.documentType}</td>
                <td className="px-4 py-3">{doc.fileName}</td>
                <td className="px-4 py-3">{doc.uploadedAt}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[doc.status]}>
                    {doc.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm" onClick={() => void view(doc.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-3 md:hidden">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{doc.guestName}</p>
              <Badge variant={statusVariant[doc.status]}>
                {doc.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted">#{doc.bookingId} · {doc.documentType}</p>
            <p className="text-sm">{doc.fileName}</p>
            <p className="text-xs text-muted">{doc.uploadedAt}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => void view(doc.id)}>
              View document
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
