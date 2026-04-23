import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Fetch recent donations
  const recentDonations = await prisma.donation.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { Devotee: true }
  });

  const totalAmountResult = await prisma.donation.aggregate({
    _sum: { totalAmount: true }
  });
  
  const totalInvoicesResult = await prisma.invoice.count();
  
  const totalDevoteesResult = await prisma.devotee.count();

  return (
    <>
      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card border border-border p-8 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">payments</span>
          </div>
          <p className="font-label-caps text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Total Amount</p>
          <h3 className="font-display-lg text-primary text-4xl mb-2">₹{totalAmountResult._sum.totalAmount || 0}</h3>
          <div className="w-full h-[1px] bg-border mt-4"></div>
        </div>

        <div className="bg-card border border-primary/20 p-8 relative overflow-hidden group shadow-md ring-1 ring-primary/5">
          <div className="absolute inset-0 opacity-5 pointer-events-none wavy-line"></div>
          <p className="font-label-caps text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Total Invoices</p>
          <h3 className="font-display-lg text-primary text-4xl mb-2">{totalInvoicesResult}</h3>
          <div className="w-full h-[1px] bg-border mt-4"></div>
        </div>

        <div className="bg-card border border-border p-8 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">group</span>
          </div>
          <p className="font-label-caps text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Devotees</p>
          <h3 className="font-display-lg text-primary text-4xl mb-2">{totalDevoteesResult}</h3>
          <div className="w-full h-[1px] bg-border mt-4"></div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Table Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="font-headline-md text-foreground">Recent Offerings</h4>
              <p className="text-sm font-body-md text-muted-foreground">Live stream of temple contributions</p>
            </div>
            <button className="text-primary font-label-caps text-[11px] uppercase tracking-widest border-b border-primary pb-1 hover:opacity-70 transition-opacity">
              View All Transactions
            </button>
          </div>

          <div className="bg-card border border-border overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted text-left border-b border-border">
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Devotee</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none border border-border bg-background flex items-center justify-center text-muted-foreground font-bold text-xs">
                          {donation.Devotee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{donation.Devotee.name}</p>
                          <p className="text-[10px] text-muted-foreground">ID: {donation.devoteeId.split("-")[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-body-md text-foreground">
                        {donation.date.toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-data-tabular font-bold text-primary">₹{donation.totalAmount}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200">Completed</span>
                    </td>
                  </tr>
                ))}
                {recentDonations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground font-body-md">
                      No offerings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (Analytics & Quick Actions) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border border-border p-6">
            <h5 className="font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest mb-6">Temple Goal</h5>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-display-lg text-foreground">₹{(totalAmountResult._sum.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs font-body-md text-muted-foreground leading-relaxed italic">
              "May the light of Dharma guide our collective prosperity."
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
