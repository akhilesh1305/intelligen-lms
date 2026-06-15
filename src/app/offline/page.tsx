import Link from "next/link";
import { CloudOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <CloudOff className="mx-auto h-16 w-16 text-slate-300" />
      <h1 className="mt-6 text-2xl font-bold text-ink">You&apos;re offline</h1>
      <p className="mt-3 text-muted">
        No internet connection. Open downloaded lessons or try again when you&apos;re back online.
      </p>
      <Card className="mt-8 text-left">
        <CardContent className="pt-6">
          <h2 className="font-bold text-ink">What still works</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Download className="h-4 w-4 text-brand-600" />
              Read downloaded lesson content
            </li>
            <li>· Progress is saved locally and syncs when online</li>
            <li>· Installed PWA opens faster from your home screen</li>
          </ul>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/offline/downloads">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Offline downloads
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button>Try dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
