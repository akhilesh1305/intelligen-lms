import Link from "next/link";
import { LayoutDashboard, Upload, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrgAdminNav({
  slug,
  active,
}: {
  slug: string;
  active: "dashboard" | "users" | "members";
}) {
  const items = [
    {
      id: "dashboard" as const,
      href: `/org/${slug}`,
      label: "Analytics",
      icon: LayoutDashboard,
    },
    {
      id: "users" as const,
      href: `/org/${slug}/users`,
      label: "All users",
      icon: Users,
    },
    {
      id: "members" as const,
      href: `/org/${slug}/members`,
      label: "Mass upload",
      icon: Upload,
    },
  ];

  return (
    <nav
      aria-label="Organization admin"
      className="flex flex-wrap gap-2 border-b border-border pb-4"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-surface text-ink hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/40"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
