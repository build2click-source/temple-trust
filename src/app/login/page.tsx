import LoginForm from "./LoginForm";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden bg-background relative">
      {/* Decorative Top Background Layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[480px]">
        {/* Temple Branding Anchor */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-32 h-32 mb-6 flex items-center justify-center p-2 bg-white border border-primary/20 shadow-xl shadow-primary/5">
            <img src="/logo.jpg?v=1.0" alt="Temple Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-headline-lg text-4xl text-primary text-center tracking-tight mb-2">
            {siteConfig.name}
          </h1>
          <p className="font-label-caps text-xs text-muted-foreground uppercase tracking-[0.2em]">
            Vedic Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border p-10 shadow-none relative overflow-hidden">
          {/* Subtle Saffron Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary"></div>
          
          <div className="mb-8">
            <h2 className="font-headline-md text-2xl text-foreground mb-2">Sacred Access</h2>
            <p className="font-body-md text-muted-foreground">Please enter your portal credentials to proceed.</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer Help */}
        <div className="mt-8 text-center">
          <p className="font-body-md text-muted-foreground opacity-60">
            Facing issues? Contact the <span className="text-primary font-semibold">Temple IT Cell</span>
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <div className="w-1 h-1 bg-border rounded-full"></div>
            <div className="w-1 h-1 bg-border rounded-full"></div>
            <div className="w-1 h-1 bg-border rounded-full"></div>
          </div>
        </div>
      </main>

      {/* Visual Embellishment: Vertical Lines */}
      <div className="fixed inset-y-0 left-[10%] w-[1px] bg-border opacity-20 pointer-events-none"></div>
      <div className="fixed inset-y-0 right-[10%] w-[1px] bg-border opacity-20 pointer-events-none"></div>
    </div>
  );
}
