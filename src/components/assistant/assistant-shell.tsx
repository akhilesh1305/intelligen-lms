"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "./chat-widget";

export function AssistantShell() {
  const pathname = usePathname();

  // Full-page assistant has its own panel; hide floating widget there and in learn mode
  if (pathname.startsWith("/assistant") || pathname.startsWith("/learn")) {
    return null;
  }

  return <ChatWidget />;
}
