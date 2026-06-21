import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { ProductTourContent } from "@/components/product-tour/product-tour-content";

export const metadata: Metadata = {
  title: "Product Tour | IntelliGen LMS",
  description:
    "Sales-ready product tour — from challenge to outcome: AI authoring, learner engagement, verifiable credentials, analytics, and enterprise results.",
  openGraph: {
    title: "Product Tour | IntelliGen LMS",
    description:
      "Follow the IntelliGen LMS narrative: challenge, platform, outcomes, benefits, and live demo — for recruiters and enterprise buyers.",
  },
};

export default async function ProductTourPage() {
  const session = await getSession();

  return <ProductTourContent isLoggedIn={!!session} />;
}
