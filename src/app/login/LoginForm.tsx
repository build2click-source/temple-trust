"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 bg-muted"></div>
      <div className="h-12 bg-muted"></div>
      <div className="h-12 bg-muted"></div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm font-body-md p-3 border border-destructive/20 text-center">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="font-label-caps text-[12px] font-semibold text-muted-foreground uppercase" htmlFor="email">Authorized Email</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">person</span>
          <input
            className="w-full pl-8 pr-2 py-2 bg-transparent border-b border-border focus:border-primary focus:ring-0 transition-all outline-none font-data-tabular"
            id="email"
            name="email"
            placeholder="yourname@shaktidham.com"
            type="email"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="font-label-caps text-[12px] font-semibold text-muted-foreground uppercase" htmlFor="password">Access Key</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">lock</span>
          <input
            className="w-full pl-8 pr-2 py-2 bg-transparent border-b border-border focus:border-primary focus:ring-0 transition-all outline-none font-data-tabular"
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input className="w-4 h-4 rounded-none border-border text-primary focus:ring-primary transition-all" type="checkbox" />
          <span className="font-label-caps text-[12px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">Stay Signed In</span>
        </label>
        <a className="font-label-caps text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline" href="#">Reset Access</a>
      </div>

      <button
        className="w-full bg-primary text-primary-foreground py-4 font-label-caps text-[14px] font-semibold tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "AUTHENTICATING..." : "INITIATE SESSION"}
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </form>
  );
}
