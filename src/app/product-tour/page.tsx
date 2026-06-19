import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { ProductTourContent } from "@/components/product-tour/product-tour-content";

export const metadata: Metadata = {
  title: "Product Tour | IntelliGen LMS",
  description:
    "Sales-ready product tour — from problem to solution, AI features, gamification, certificates, analytics, and enterprise outcomes. Built for demos and recruiter presentations.",
  openGraph: {
    title: "Product Tour | IntelliGen LMS",
    description:
      "Follow the IntelliGen LMS narrative: challenge, platform, features, benefits, and live demo — for recruiters and enterprise buyers.",
  },
};

export default async function ProductTourPage() {
  const session = await getSession();

  return <ProductTourContent isLoggedIn={!!session} />;
}
