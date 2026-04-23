"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully. You will remain logged in." });
      setNewPassword("");
      setConfirmPassword("");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-primary mb-2">Account Settings</h1>
        <p className="font-body-md text-muted-foreground">Manage your personal access credentials.</p>
      </div>

      <div className="bg-card border border-border p-8 max-w-xl">
        <h2 className="font-label-caps text-xs text-primary mb-6 uppercase tracking-widest">Change Access Key</h2>
        
        {message.text && (
          <div className={`p-4 mb-6 text-sm font-body-md border ${
            message.type === 'error' 
              ? 'bg-destructive/10 text-destructive border-destructive/20' 
              : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div>
            <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 font-data-tabular"
            />
          </div>
          <div>
            <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 font-data-tabular"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-primary-foreground font-label-caps text-xs hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
          >
            {isSubmitting ? "UPDATING..." : "UPDATE ACCESS KEY"}
          </button>
        </form>
      </div>
    </div>
  );
}
