import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { AssistantShell } from "@/components/assistant/assistant-shell";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IntelliGen LMS — Learn Without Limits",
  description:
    "Access world-class courses from top instructors. Build skills, earn credentials, and advance your career with IntelliGen LMS.",
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "IntelliGen LMS — Learn Without Limits",
    description:
      "Access world-class courses from top instructors. Build skills, earn credentials, and advance your career.",
    images: ["/logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} font-sans`}>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <ConditionalFooter />
        <AssistantShell />
      </body>
    </html>
  );
}
