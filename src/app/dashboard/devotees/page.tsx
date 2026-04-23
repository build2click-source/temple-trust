import { getAllDevotees } from "@/actions/donation";
import { DevoteeClient } from "@/components/DevoteeClient";

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

      <DevoteeClient initialDevotees={devotees} />
    </div>
  );
}
