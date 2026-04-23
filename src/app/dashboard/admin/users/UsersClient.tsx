"use client";

import { useState } from "react";
import { createUser, deleteUserAccount, resetUserPassword } from "@/actions/users";
import { Role } from "@prisma/client";

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("CLERK");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newUser = await createUser(email, username, role, password);
      setUsers([newUser, ...users]);
      setIsAddModalOpen(false);
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("CLERK");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await deleteUserAccount(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReset = async (userId: string) => {
    const newPass = prompt("Enter new password for this user:", "ResetPassword123!");
    if (!newPass) return;
    
    try {
      await resetUserPassword(userId, newPass);
      alert("Password reset successfully.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-6 py-3 font-label-caps text-xs tracking-widest uppercase hover:bg-primary/90 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add New User
        </button>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-muted-foreground border-b border-border font-label-caps text-[10px] tracking-widest uppercase">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-foreground">{user.username || "N/A"}</div>
                  <div className="text-[10px] text-muted-foreground font-data-tabular">ID: {user.id.split('-')[0]}</div>
                </td>
                <td className="px-6 py-4 font-body-md text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                    user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleReset(user.id)}
                    className="text-xs font-label-caps text-muted-foreground hover:text-primary transition-colors border border-border px-3 py-1"
                  >
                    RESET PASS
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-xs font-label-caps text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20 px-3 py-1"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md p-8">
            <h2 className="font-heading text-2xl text-primary mb-6">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs text-muted-foreground block mb-1">Email</label>
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 font-body-md"
                />
              </div>
              <div>
                <label className="font-label-caps text-xs text-muted-foreground block mb-1">Username / Name</label>
                <input 
                  type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 font-body-md"
                />
              </div>
              <div>
                <label className="font-label-caps text-xs text-muted-foreground block mb-1">Role</label>
                <select 
                  value={role} onChange={e => setRole(e.target.value as Role)}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 font-body-md"
                >
                  <option value="CLERK">Clerk</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="font-label-caps text-xs text-muted-foreground block mb-1">Initial Password (Optional)</label>
                <input 
                  type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Auto-generated if empty"
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 font-body-md"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 font-label-caps text-xs border border-border hover:bg-muted transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-label-caps text-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "SAVING..." : "SAVE USER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
