import { getLedger, getStats } from "@/actions/donation";
import { LedgerClient } from "@/components/LedgerClient";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function LedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const today = format(new Date(), "yyyy-MM-dd");
  const startDate = from || today;
  const endDate = to || today;

  const donations = await getLedger(startDate, endDate);
  const stats = await getStats(startDate, endDate);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl text-foreground">Divine Ledger</h1>
          <p className="text-muted-foreground mt-2 font-body-md italic text-lg">
            "Sewa Hi Parmo Dharma" — Recording the sacred contributions of the devotees.
          </p>
        </div>
      </header>

      <LedgerClient initialDonations={donations} stats={stats} />
    </div>
  );
}
