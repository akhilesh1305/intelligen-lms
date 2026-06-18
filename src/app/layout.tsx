import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-certificate",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? "https://learn.intelligenlms.com"
    : "http://localhost:3001");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "IntelliGen LMS — Learn Without Limits",
  description:
    "Access world-class courses from top instructors. Build skills, earn credentials, and advance your career with IntelliGen LMS.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IntelliGen LMS",
  },
  icons: {
    icon: [
      { url: "/logo-icon.svg", type: "image/svg+xml" },
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "IntelliGen LMS — Learn Without Limits",
    description:
      "Access world-class courses from top instructors. Build skills, earn credentials, and advance your career.",
    images: ["/logo-icon.svg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
