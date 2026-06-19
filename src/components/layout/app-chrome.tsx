import { headers } from "next/headers";
import { Navbar } from "./navbar";
import { ConditionalFooter } from "./conditional-footer";
import { AssistantShell } from "@/components/assistant/assistant-shell";
import { MobileShell } from "@/components/mobile/mobile-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { DemoModeBanner } from "@/components/demo/demo-mode-banner";

function isAuthPage(pathname: string) {
  return pathname.startsWith("/login") || pathname === "/register";
}

export async function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const authPage = isAuthPage(pathname);

  return (
    <>
      {!authPage ? <Navbar /> : null}
      {!authPage ? <DemoModeBanner /> : null}
      <PageTransition authPage={authPage}>
        {authPage ? (
          children
        ) : (
          <main className="mobile-main min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)]">
            {children}
          </main>
        )}
      </PageTransition>
      <ConditionalFooter />
      <AssistantShell />
      <MobileShell />
    </>
  );
}
