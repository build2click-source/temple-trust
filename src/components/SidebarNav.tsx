"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 flex flex-col gap-1">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-5 py-4 font-heading text-sm tracking-wide transition-all",
              isActive 
                ? "text-primary font-bold bg-primary/10 border-r-4 border-primary translate-x-1" 
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            )}
          >
            <span className={cn("material-symbols-outlined", isActive && "font-bold")}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
