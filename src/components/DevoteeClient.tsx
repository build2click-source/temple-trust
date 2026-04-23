"use client";

import { useState } from "react";
import { format } from "date-fns";
import { updateDevotee, deleteDevotee } from "@/actions/donation";

interface Devotee {
  id: string;
  name: string;
  phone: string | null;
  pan: string | null;
  city: string | null;
  state: string | null;
  createdAt: Date;
  _count: {
    Donations: number;
  };
}

export function DevoteeClient({ initialDevotees }: { initialDevotees: any[] }) {
  const [devotees, setDevotees] = useState<Devotee[]>(initialDevotees);
  const [editingDevotee, setEditingDevotee] = useState<Devotee | null>(null);
  const [viewingDevotee, setViewingDevotee] = useState<Devotee | null>(null);

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDevotee) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      pan: formData.get("pan") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
    };

    try {
      const updated = await updateDevotee(editingDevotee.id, data);
      setDevotees(prev => prev.map(d => d.id === editingDevotee.id ? { ...d, ...data } : d));
      setEditingDevotee(null);
    } catch (err) {
      alert("Failed to update devotee.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this devotee profile? All historical donation records for this devotee will be permanently removed. This action cannot be undone.")) return;
    
    try {
      await deleteDevotee(id);
      setDevotees(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert("Failed to delete devotee. Ensure they have no active donation records.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devotees.map((devotee) => (
          <div key={devotee.id} className="bg-card border border-border p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 -mr-10 -mt-10 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {devotee.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="font-label-caps text-[9px] text-muted-foreground uppercase">Devotee ID</p>
                  <p className="font-data-tabular text-[10px] text-primary font-bold">#{devotee.id.split("-")[0].toUpperCase()}</p>
                </div>
              </div>

              <h3 className="font-heading text-xl text-foreground mb-1">{devotee.name}</h3>
              <p className="font-data-tabular text-sm text-muted-foreground mb-6">
                <span className="material-symbols-outlined text-xs align-middle mr-1">call</span>
                {devotee.phone || "No phone registered"}
              </p>

              <div className="pt-4 border-t border-border border-dashed flex justify-between items-center">
                <div className="flex gap-2">
                   <button 
                    onClick={() => setViewingDevotee(devotee)}
                    className="text-[10px] font-label-caps text-primary hover:underline flex items-center gap-1"
                   >
                    VIEW
                    <span className="material-symbols-outlined text-xs">visibility</span>
                  </button>
                  <button 
                    onClick={() => setEditingDevotee(devotee)}
                    className="text-[10px] font-label-caps text-muted-foreground hover:text-primary hover:underline flex items-center gap-1"
                  >
                    EDIT
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(devotee.id)}
                    className="text-[10px] font-label-caps text-muted-foreground hover:text-red-600 hover:underline flex items-center gap-1"
                  >
                    DELETE
                    <span className="material-symbols-outlined text-xs">delete</span>
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-label-caps text-[9px] text-muted-foreground uppercase">Offerings</p>
                  <p className="font-heading text-lg text-primary">{devotee._count.Donations}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingDevotee && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="font-heading text-2xl text-primary mb-6">Edit Devotee Profile</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <label className="font-label-caps text-xs text-muted-foreground">Devotee Name</label>
                <input 
                  name="name" 
                  defaultValue={editingDevotee.name}
                  required 
                  className="w-full bg-muted border-border p-3 text-sm focus:ring-1 ring-primary outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-xs text-muted-foreground">Phone Number</label>
                <input 
                  name="phone" 
                  defaultValue={editingDevotee.phone || ""}
                  className="w-full bg-muted border-border p-3 text-sm focus:ring-1 ring-primary outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-xs text-muted-foreground">City</label>
                  <input 
                    name="city" 
                    defaultValue={editingDevotee.city || ""}
                    className="w-full bg-muted border-border p-3 text-sm focus:ring-1 ring-primary outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-xs text-muted-foreground">State</label>
                  <input 
                    name="state" 
                    defaultValue={editingDevotee.state || ""}
                    className="w-full bg-muted border-border p-3 text-sm focus:ring-1 ring-primary outline-none" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-xs text-muted-foreground">PAN Number (Optional)</label>
                <input 
                  name="pan" 
                  defaultValue={editingDevotee.pan || ""}
                  className="w-full bg-muted border-border p-3 text-sm focus:ring-1 ring-primary outline-none uppercase" 
                  placeholder="ABCDE1234F"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingDevotee(null)}
                  className="flex-1 border border-border py-3 font-label-caps text-xs hover:bg-muted transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground py-3 font-label-caps text-xs hover:bg-primary/90 transition-colors"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingDevotee && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                {viewingDevotee.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={() => setViewingDevotee(null)} className="text-muted-foreground hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <h2 className="font-heading text-3xl text-foreground mb-1">{viewingDevotee.name}</h2>
            <p className="text-primary font-data-tabular text-sm font-bold mb-8">Devotee ID: #{viewingDevotee.id.split("-")[0].toUpperCase()}</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-label-caps text-[10px] text-muted-foreground uppercase mb-1">Contact</p>
                  <p className="font-body-md text-sm">{viewingDevotee.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-muted-foreground uppercase mb-1">Total Offerings</p>
                  <p className="font-heading text-xl">{viewingDevotee._count.Donations}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-label-caps text-[10px] text-muted-foreground uppercase mb-1">PAN Number</p>
                  <p className="font-data-tabular text-sm font-bold uppercase">{viewingDevotee.pan || "N/A"}</p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-muted-foreground uppercase mb-1">Location</p>
                  <p className="font-body-md text-sm">
                    {viewingDevotee.city || "N/A"}, {viewingDevotee.state || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-label-caps text-[10px] text-muted-foreground uppercase mb-1">Registered On</p>
                <p className="font-body-md text-sm">{format(new Date(viewingDevotee.createdAt), "MMMM do, yyyy")}</p>
              </div>
            </div>

            <button 
              onClick={() => setViewingDevotee(null)}
              className="w-full mt-10 bg-primary text-primary-foreground py-4 font-label-caps text-xs tracking-widest hover:bg-primary/90 transition-colors"
            >
              CLOSE DETAILS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
