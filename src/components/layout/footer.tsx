import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const footerLinks = {
  Platform: [
    { label: "Browse courses", href: "/courses" },
    { label: "For instructors", href: "/register" },
    { label: "My learning", href: "/dashboard" },
  ],
  Categories: [
    { label: "Development", href: "/courses?q=development" },
    { label: "Data Science", href: "/courses?q=data" },
    { label: "Design", href: "/courses?q=design" },
    { label: "Business", href: "/courses?q=business" },
  ],
  Company: [
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
    { label: "Careers", href: "/" },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-br from-slate-950 via-brand-900 to-slate-950 text-slate-300">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-accent-violet/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo
              href="/"
              variant="full"
              size="lg"
              inverted
              iconOnlyMark
              showText
              animated={false}
              className="[&_svg]:h-14 [&_svg]:w-auto sm:[&_svg]:h-16"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              World-class learning for everyone. Build skills with courses from
              top instructors and advance your career.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700/60 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} IntelliGen LMS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span className="cursor-pointer transition-colors hover:text-slate-300">
              Privacy Policy
            </span>
            <span className="cursor-pointer transition-colors hover:text-slate-300">
              Terms of Service
            </span>
            <span className="cursor-pointer transition-colors hover:text-slate-300">
              Cookie Settings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
