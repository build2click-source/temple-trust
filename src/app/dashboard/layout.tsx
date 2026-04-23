import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { SidebarNav } from "@/components/SidebarNav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  const role = dbUser?.role || "CLERK";
  const name = dbUser?.username || user.email?.split("@")[0] || "User";

  const navItems = [
    { label: "Sanctum Dashboard", href: "/dashboard", icon: "temple_hindu" },
    { label: "Record Offering", href: "/dashboard/offering", icon: "payments" },
    { label: "Daily Ledger", href: "/dashboard/ledger", icon: "receipt_long" },
    { label: "Devotee Directory", href: "/dashboard/devotees", icon: "group" },
  ];

  return (
    <div className="bg-background text-foreground font-body-md min-h-screen flex overflow-hidden">
      {/* SideNavBar Component */}
      <aside className="h-screen w-64 border-r fixed left-0 top-0 bg-card border-border flex flex-col py-6 px-0 z-50">
        <div className="mb-10 px-6 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center p-1 bg-white/5 border border-primary/20">
            <img src="/logo.jpg?v=1.0" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-black text-primary font-headline-md tracking-tight uppercase leading-tight">
              {siteConfig.shortName}
            </h1>
            <p className="text-[10px] text-muted-foreground font-label-caps uppercase tracking-widest leading-none mt-1">
              Divine Portal
            </p>
          </div>
        </div>

        <SidebarNav items={navItems} />

        <div className="mt-auto pt-6 border-t border-border flex flex-col gap-1 px-0">
          {role === "ADMIN" && (
            <Link href="/dashboard/admin/users" className="flex items-center gap-4 px-5 py-3 text-muted-foreground hover:text-primary transition-colors text-sm font-heading">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              User Management
            </Link>
          )}
          <Link href="/dashboard/settings" className="flex items-center gap-4 px-5 py-3 text-muted-foreground hover:text-primary transition-colors text-sm font-heading">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <div className="px-0">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* TopAppBar Component */}
        <header className="bg-background text-primary font-heading antialiased border-b border-border flex justify-between items-center h-16 px-8 w-full sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-foreground">Sanctum Dashboard</h2>
            <span className="text-muted-foreground/30 mx-2">/</span>
            <span className="text-sm font-body-md text-muted-foreground">
              {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <div className="w-8 h-8 rounded-none border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="leading-none">
                <p className="text-xs font-bold text-foreground">{name}</p>
                <p className="text-[10px] text-primary font-label-caps uppercase mt-1">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}
