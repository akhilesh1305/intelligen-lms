"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatPanel } from "./chat-panel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="safe-bottom fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-elevated transition-transform hover:scale-105 hover:bg-brand-700 sm:bottom-6 sm:right-6"
          aria-label="Open AI Learning Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
