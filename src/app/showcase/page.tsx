import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { ShowcaseContent } from "@/components/showcase/showcase-content";

export const metadata: Metadata = {
  title: "Platform Showcase | IntelliGen LMS",
  description:
    "Visual tour of IntelliGen LMS — homepage, dashboard, AI learning, certificates, analytics, and game hub. Built for recruiters and client presentations.",
  openGraph: {
    title: "Platform Showcase | IntelliGen LMS",
    description:
      "See every major surface of IntelliGen LMS in one scrollable gallery.",
  },
};

export default async function ShowcasePage() {
  const session = await getSession();
  return <ShowcaseContent isLoggedIn={!!session} />;
}
