import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const footerLinks = {
  Product: [
    { label: "Product tour", href: "/product-tour" },
    { label: "Showcase", href: "/showcase" },
    { label: "Courses", href: "/courses" },
    { label: "AI tools", href: "/ai" },
    { label: "Learning paths", href: "/paths" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Certificates", href: "/certificates" },
  ],
  Company: [
    { label: "Book a demo", href: "mailto:hello@intelligenlms.com?subject=Enterprise%20Demo" },
    { label: "Contact", href: "mailto:hello@intelligenlms.com" },
    { label: "For instructors", href: "/register" },
    { label: "Organizations", href: "/org" },
  ],
  Resources: [
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Corporate games", href: "/corporate-games" },
    { label: "Coach", href: "/coach" },
    { label: "Certificates demo", href: "/certificates/demo" },
  ],
  Legal: [
    { label: "Privacy", href: "mailto:hello@intelligenlms.com?subject=Privacy" },
    { label: "Terms", href: "mailto:hello@intelligenlms.com?subject=Terms" },
    { label: "Security", href: "/settings/security" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-panel dark:bg-slate-950" data-screenshot-clutter>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo
              href="/"
              variant="full"
              size="lg"
              iconOnlyMark
              showText
              animated={false}
              className="[&_svg]:h-12 [&_svg]:w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              AI-powered enterprise learning. Create courses, track progress, and
              issue credentials — built for modern teams.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors duration-150 hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} IntelliGen LMS. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built for teams who expect Linear-grade polish.
          </p>
        </div>
      </div>
    </footer>
  );
}
