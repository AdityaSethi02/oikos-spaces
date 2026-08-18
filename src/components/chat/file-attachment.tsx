"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export interface FileAttachmentProps {
  fileName: string;
  fileType?: string;
  fileSize?: string;
  status?: "uploading" | "uploaded" | "failed";
  onRemove?: () => void;
  onView?: () => void;
  className?: string;
}

export function FileAttachment({
  fileName,
  fileType,
  fileSize,
  status = "uploaded",
  onRemove,
  onView,
  className,
}: FileAttachmentProps) {
  const type = fileType || fileName.split(".").pop()?.toUpperCase() || "FILE";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3",
        status === "failed" && "border-red-200 bg-red-50",
        className,
      )}
    >
      <button
        type="button"
        onClick={onView}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-light text-accent" aria-hidden="true">
          {type === "PDF" ? <Icons.FileText className="h-5 w-5" /> : <Icons.Image className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted">
            {type}
            {fileSize ? ` · ${fileSize}` : ""}
            {" · "}
            {status === "uploading" && "Uploading…"}
            {status === "uploaded" && "Uploaded"}
            {status === "failed" && "Upload failed"}
          </p>
        </div>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-sm text-muted hover:text-error"
        >
          Remove
        </button>
      )}
    </div>
  );
}
