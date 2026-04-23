import { prisma } from "@/lib/prisma";
import { getStats } from "@/actions/donation";
import { format } from "date-fns";

import { DashboardDateFilter } from "@/components/DashboardDateFilter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const filterDate = date || format(new Date(), "yyyy-MM-dd");

  // Fetch stats using our action
  const stats = await getStats(filterDate);

  // Fetch recent donations for the selected date
  const recentDonations = await prisma.donation.findMany({
    where: {
      date: new Date(filterDate)
    },
    orderBy: { date: 'desc' },
    include: { Devotee: true }
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="font-headline-md text-3xl text-foreground">Temple Overview</h2>
          <p className="text-muted-foreground font-body-md italic mt-1">Financial statistics for {format(new Date(filterDate), "MMMM do, yyyy")}</p>
        </div>
        
        <DashboardDateFilter initialDate={filterDate} />
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-card border border-border p-6 relative overflow-hidden group shadow-sm transition-all hover:border-primary/30">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-4xl">payments</span>
          </div>
          <p className="font-label-caps text-muted-foreground uppercase tracking-widest text-[9px] mb-2">Collected Amount (Daily)</p>
          <h3 className="font-display-lg text-primary text-3xl mb-1">₹{stats.rangeAmount.toLocaleString()}</h3>
          <div className="w-full h-[1px] bg-border mt-3"></div>
        </div>

        <div className="bg-card border border-primary/20 p-6 relative overflow-hidden group shadow-md ring-1 ring-primary/5 transition-all hover:ring-primary/20 bg-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-4xl text-primary">account_balance_wallet</span>
          </div>
          <p className="font-label-caps text-primary uppercase tracking-widest text-[9px] mb-2">Total Collection (Global)</p>
          <h3 className="font-display-lg text-primary text-3xl mb-1">₹{stats.totalAmount.toLocaleString()}</h3>
          <div className="w-full h-[1px] bg-primary/20 mt-3"></div>
        </div>

        <div className="bg-card border border-border p-6 relative overflow-hidden group shadow-sm transition-all hover:border-primary/30">
          <div className="absolute inset-0 opacity-5 pointer-events-none wavy-line"></div>
          <p className="font-label-caps text-muted-foreground uppercase tracking-widest text-[9px] mb-2">Daily Invoices</p>
          <h3 className="font-display-lg text-primary text-3xl mb-1">{stats.totalInvoices}</h3>
          <div className="w-full h-[1px] bg-border mt-3"></div>
        </div>

        <div className="bg-card border border-border p-6 relative overflow-hidden group shadow-sm transition-all hover:border-primary/30">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-4xl">group</span>
          </div>
          <p className="font-label-caps text-muted-foreground uppercase tracking-widest text-[9px] mb-2">Total Devotees</p>
          <h3 className="font-display-lg text-primary text-3xl mb-1">{stats.totalDevotees}</h3>
          <div className="w-full h-[1px] bg-border mt-3"></div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Table Section */}
        <div className="lg:col-span-12 space-y-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="font-headline-md text-foreground">Transactions for this Date</h4>
              <p className="text-sm font-body-md text-muted-foreground">Recorded offerings on {format(new Date(filterDate), "dd MMM yyyy")}</p>
            </div>
            <a href="/dashboard/ledger" className="text-primary font-label-caps text-[11px] uppercase tracking-widest border-b border-primary pb-1 hover:opacity-70 transition-opacity">
              View All Transactions
            </a>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 text-left border-b border-border">
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Devotee</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentDonations.map((donation) => (
                  <tr key={donation.id} className={`hover:bg-muted/30 transition-colors ${donation.status === 'CANCELLED' ? 'opacity-60 italic' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none border border-border bg-background flex items-center justify-center text-muted-foreground font-bold text-xs">
                          {donation.Devotee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground line-clamp-1">{donation.Devotee.name}</p>
                          <p className="text-[10px] text-muted-foreground">ID: {donation.devoteeId.split("-")[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-body-md text-foreground">
                        {format(new Date(donation.date), "dd MMM yyyy")}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`text-sm font-data-tabular font-bold ${donation.status === 'CANCELLED' ? 'text-muted-foreground line-through' : 'text-primary'}`}>
                        ₹{donation.totalAmount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      {donation.status === 'CANCELLED' ? (
                        <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-red-50 text-red-700 border border-red-200">Cancelled</span>
                      ) : (
                        <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200">Collected</span>
                      )}
                    </td>
                  </tr>
                ))}
                {recentDonations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-body-md">
                      <span className="material-symbols-outlined text-4xl block mb-2 opacity-20">inventory_2</span>
                      No offerings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
