import { getAllDevotees } from "@/actions/donation";
import { format } from "date-fns";

export default async function DevoteesPage() {
  const devotees = await getAllDevotees();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-4xl text-foreground">Devotee Directory</h1>
          <p className="text-muted-foreground mt-2 font-body-md">Registry of all registered devotees and their contributions</p>
        </div>
        <div className="text-right">
          <p className="font-label-caps text-xs text-primary uppercase tracking-widest">Total Devotees</p>
          <p className="font-heading text-2xl">{devotees.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devotees.length === 0 ? (
          <div className="col-span-full p-20 text-center border border-dashed border-border text-muted-foreground font-heading italic bg-card">
            The devotee directory is currently empty.
          </div>
        ) : (
          devotees.map((devotee) => (
            <div key={devotee.id} className="bg-card border border-border p-6 relative group overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 -mr-10 -mt-10 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {devotee.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="font-label-caps text-[10px] text-muted-foreground uppercase">Joined</p>
                    <p className="font-data-tabular text-[10px]">{format(new Date(devotee.createdAt), "MMM yyyy")}</p>
                  </div>
                </div>

                <h3 className="font-heading text-xl text-foreground mb-1">{devotee.name}</h3>
                <p className="font-data-tabular text-sm text-muted-foreground mb-6">
                  <span className="material-symbols-outlined text-xs align-middle mr-1">call</span>
                  {devotee.phone || "No phone registered"}
                </p>

                <div className="pt-4 border-t border-border border-dashed flex justify-between items-center">
                  <div>
                    <p className="font-label-caps text-[9px] text-muted-foreground uppercase">Total Offerings</p>
                    <p className="font-heading text-lg text-primary">{devotee._count.Donations}</p>
                  </div>
                  <button className="text-xs font-label-caps text-primary hover:underline flex items-center gap-1">
                    VIEW DETAILS
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
