"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { label: "Insurers", href: "/dashboard/system-config/insurers" },
  { label: "Claim Types", href: "/dashboard/system-config/claim-types" },
];

export default function SystemConfigLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-muted/30 py-8 px-4">
        <nav className="flex flex-col gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded font-medium transition-colors ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-8">{children}</main>
    </div>
  );
} 