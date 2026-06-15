"use client";



import Link from "next/link";

import {

  BookOpen,

  Briefcase,

  Map,

  Sparkles,

} from "lucide-react";

import { HeaderMoreMenu } from "@/components/layout/header-more-menu";



const PRIMARY_LINKS = [

  { href: "/courses", label: "Explore", icon: BookOpen },

  { href: "/paths", label: "Paths", icon: Map },

  { href: "/coach", label: "Coach", icon: Briefcase },

  { href: "/ai", label: "AI", icon: Sparkles },

] as const;



const linkClass =

  "header-nav-stagger nav-link-hover group inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-ink hover:bg-surface xl:px-2.5";



export function DesktopNavLinks() {

  return (

    <div className="hidden min-w-0 items-center gap-0.5 lg:flex">

      {PRIMARY_LINKS.map((link, i) => {

        const Icon = link.icon;

        return (

          <Link

            key={link.href}

            href={link.href}

            className={linkClass}

            title={link.label}

            style={{ animationDelay: `${120 + i * 45}ms` }}

          >

            <Icon className="h-4 w-4 shrink-0 text-brand-600 transition-transform duration-200 group-hover:scale-110 dark:text-brand-400" />

            <span className="hidden xl:inline">{link.label}</span>

          </Link>

        );

      })}



      <HeaderMoreMenu

        variant="desktop"

        style={{ animationDelay: `${120 + PRIMARY_LINKS.length * 45}ms` }}

      />

    </div>

  );

}

