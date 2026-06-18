import { History, Swords, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MODES = [
  {
    icon: Swords,
    title: "Challenge friend",
    description: "1v1 quiz duel with a shareable link",
    tag: "Soon",
  },
  {
    icon: Users,
    title: "Team battle",
    description: "Squad up and compete in group rounds",
    tag: "Soon",
  },
  {
    icon: History,
    title: "Match history",
    description: "Review past battles, scores, and ELO",
    tag: "Preview",
  },
] as const;

export function BattleModeShowcase({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-violet-500/30 bg-gradient-to-br from-violet-700/90 via-brand-800 to-slate-900 p-6 text-white shadow-elevated",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="relative">
        <Badge className="mb-3 border-white/20 bg-white/10 text-white">UI only</Badge>
        <h3 className="text-xl font-bold">Battle mode</h3>
        <p className="mt-2 text-sm text-violet-100/90">
          Real-time quiz battles — preview of upcoming competitive modes.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {MODES.map((mode) => (
            <div
              key={mode.title}
              className="rounded-[14px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
            >
              <mode.icon className="h-5 w-5 text-cyan-200" />
              <p className="mt-2 text-sm font-bold">{mode.title}</p>
              <p className="mt-1 text-xs text-violet-100/80">{mode.description}</p>
              <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase">
                {mode.tag}
              </span>
            </div>
          ))}
        </div>

        <Button
          type="button"
          disabled
          className="mt-5 w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
        >
          Battle mode — coming soon
        </Button>
      </div>
    </section>
  );
}
