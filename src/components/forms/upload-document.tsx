"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface UploadDocumentProps {
  title?: string;
  description?: string;
  privacyNote?: string;
  onUpload?: (file: File) => void;
}

export function UploadDocument({
  title = "Government ID",
  description = "Your host has requested a valid government-issued ID.",
  privacyNote = "Your document is shared only with the host for your booking.",
  onUpload,
}: UploadDocumentProps) {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(f.type) || f.size > 10 * 1024 * 1024) {
      setFailed(true);
      setFile(f);
      showToast("Document upload failed. Use PDF, JPG, or PNG under 10 MB.", "error");
      return;
    }
    setFailed(false);
    setFile(f);
    onUpload?.(f);
    showToast("Document uploaded successfully (demo).", "success");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-lg">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragOver ? "border-accent bg-accent-light/30" : "border-border bg-background",
        )}
      >
        <Icons.CloudUpload className="h-10 w-10 opacity-50" aria-hidden />
        <p className="mt-3 text-sm font-medium text-foreground">
          Drag and drop your file here
        </p>
        <p className="mt-1 text-xs text-muted">PDF, JPG, or PNG up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </Button>
      </div>

      {failed && (
        <p className="text-sm text-error">Document upload failed. Please try a smaller PDF, JPG, or PNG.</p>
      )}

      {file && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className={failed ? "text-error" : "text-green-600"} aria-hidden="true">
              {failed ? <Icons.Alert className="h-5 w-5" /> : <Icons.Check className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB · {failed ? "Failed" : "Uploaded"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setFailed(false);
            }}
            className="min-h-11 shrink-0 px-2 text-sm text-muted hover:text-error"
          >
            Remove
          </button>
        </div>
      )}

      <p className="text-xs text-muted">{privacyNote}</p>
    </div>
  );
}
