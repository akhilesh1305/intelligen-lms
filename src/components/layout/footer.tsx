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
    <footer className="border-t border-slate-200 bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="full" size="md" className="brightness-0 invert" />
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
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} IntelliGen LMS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
