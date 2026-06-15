"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CoachAction } from "@/lib/coach/insights";

type Plan = {
  title: string;
  summary: string;
  weeklyFocus: string;
  actions: CoachAction[];
  source: string;
};

const PRIORITY_VARIANT: Record<CoachAction["priority"], "warning" | "brand" | "default"> = {
  high: "warning",
  medium: "brand",
  low: "default",
};

export function CoachActionPlan() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coach/plan")
      .then((r) => r.json())
      .then((data) => {
        setPlan(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Building your weekly plan…
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-ink">{plan.title}</h3>
        <p className="mt-1 text-sm text-muted">{plan.summary}</p>
        <p className="mt-2 text-sm text-ink">
          <Target className="mr-1 inline h-4 w-4 text-brand-600" />
          <strong>This week:</strong> {plan.weeklyFocus}
        </p>
      </div>
      <div className="space-y-3">
        {plan.actions.map((action) => (
          <Card key={action.label}>
            <CardContent className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={PRIORITY_VARIANT[action.priority]}>
                    {action.priority}
                  </Badge>
                  <p className="font-medium text-ink">{action.label}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{action.description}</p>
              </div>
              {action.href ? (
                <Link
                  href={action.href}
                  className="text-sm font-semibold text-brand-600 hover:underline"
                >
                  Go →
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted">Plan source: {plan.source}</p>
    </div>
  );
}
