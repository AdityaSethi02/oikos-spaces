"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileAttachment } from "@/components/chat/file-attachment";
import { UploadDocument } from "@/components/forms/upload-document";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/data/mock/conversations";

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend?: (message: string) => void;
  onAttach?: (message: ChatMessage) => void;
  placeholder?: string;
  showIdUpload?: boolean;
}

export function ChatWindow({
  messages,
  onSend,
  onAttach,
  placeholder = "Type a message…",
  showIdUpload = false,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [idOpen, setIdOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend?.(input);
    setInput("");
  };

  const handleFile = (file: File, type: ChatMessage["type"]) => {
    onAttach?.({
      id: `att-${Date.now()}`,
      senderId: "guest",
      senderName: "You",
      senderRole: "guest",
      type,
      content: file.name,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      timestamp: new Date().toISOString(),
    });
    setAttachOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setAttachOpen((v) => !v)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-muted hover:bg-background"
              aria-label="Attach file"
              aria-expanded={attachOpen}
            >
              <Icons.Paperclip className="h-5 w-5" />
            </button>
            {attachOpen && (
              <div
                className="absolute bottom-12 left-0 z-20 w-52 rounded-xl border border-border bg-surface p-2 shadow-soft"
                role="menu"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf,.png,.jpg,.jpeg"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const isPdf = file.type === "application/pdf";
                    handleFile(file, isPdf ? "document" : "image");
                  }}
                />
                <button
                  type="button"
                  role="menuitem"
                  className="w-full min-h-11 rounded-lg px-3 py-2 text-left text-sm hover:bg-background"
                  onClick={() => fileRef.current?.click()}
                >
                  Photo or PDF
                </button>
                {showIdUpload && (
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full min-h-11 rounded-lg px-3 py-2 text-left text-sm hover:bg-background"
                    onClick={() => {
                      setAttachOpen(false);
                      setIdOpen(true);
                    }}
                  >
                    Government ID
                  </button>
                )}
              </div>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder}
            rows={1}
            className="min-h-[44px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          />
          <Button onClick={handleSend} size="md" className="shrink-0 px-3 sm:px-5" aria-label="Send message">
            <Icons.Send className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>

      <Modal open={idOpen} onClose={() => setIdOpen(false)} title="Share government ID">
        <UploadDocument
          onUpload={(file) => {
            handleFile(file, "document");
            setIdOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <p className="rounded-full bg-background px-4 py-1.5 text-xs text-muted">
          {message.content}
        </p>
      </div>
    );
  }

  const isGuest = message.senderRole === "guest";

  return (
    <div className={cn("flex", isGuest ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%]",
          isGuest
            ? "bg-stone-200/80 text-foreground"
            : "border border-border bg-surface text-foreground",
        )}
      >
        {!isGuest && message.senderRole === "host" && (
          <p className="mb-1 text-xs font-medium text-accent">{message.senderName}</p>
        )}
        {message.type === "document" || message.type === "image" ? (
          <FileAttachment
            fileName={message.fileName || message.content}
            fileSize={message.fileSize}
            fileType={message.type === "image" ? "JPG" : "PDF"}
            className="border-0 bg-transparent p-0"
          />
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
        <p className="mt-1.5 text-[10px] text-muted">
          {new Date(message.timestamp).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
