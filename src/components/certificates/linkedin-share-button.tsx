"use client";

import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

type LinkedInShareButtonProps = {
  certificateNo: string;
  courseTitle: string;
  verifyUrl: string;
  variant?: "primary" | "outline" | "soft";
  size?: "sm" | "md" | "lg";
};

export function LinkedInShareButton({
  certificateNo,
  courseTitle,
  verifyUrl,
  variant = "soft",
  size = "md",
}: LinkedInShareButtonProps) {
  const shareText = `I earned a certificate for completing "${courseTitle}" on IntelliGen LMS. Verify: ${certificateNo}`;

  function handleShare() {
    const url = new URL("https://www.linkedin.com/sharing/share-offsite/");
    url.searchParams.set("url", verifyUrl);
    window.open(url.toString(), "_blank", "noopener,noreferrer,width=600,height=600");
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleShare}
      title={shareText}
    >
      <Linkedin className="h-4 w-4" />
      Share on LinkedIn
    </Button>
  );
}
