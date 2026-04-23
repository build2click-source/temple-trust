"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex items-center gap-4 px-5 py-3 text-muted-foreground text-sm font-heading hover:text-primary transition-colors w-full text-left"
    >
      <span className="material-symbols-outlined">logout</span>
      Sign Out
    </button>
  );
}
