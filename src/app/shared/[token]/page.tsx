import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvoicePrintTemplate from "@/components/InvoicePrintTemplate";
import { siteConfig } from "@/config/site";

export default async function SharedInvoicesPage({ params }: { params: { token: string } }) {
  const sharedLink = await prisma.sharedLink.findUnique({
    where: { token: params.token },
    include: { Devotee: true }
  });

  if (!sharedLink) {
    notFound();
  }

  // Check expiration
  if (sharedLink.expiresAt && sharedLink.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl text-primary font-heading mb-4">Link Expired</h1>
          <p className="text-muted-foreground">This secure link has expired for your protection.</p>
        </div>
      </div>
    );
  }

  // Fetch all invoices for this devotee on this specific date
  const invoices = await prisma.invoice.findMany({
    where: {
      Donation: {
        devoteeId: sharedLink.devoteeId,
        date: sharedLink.date
      }
    },
    include: {
      Donation: true
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">temple_hindu</span>
          </div>
          <h1 className="text-3xl font-heading text-primary">{siteConfig.name}</h1>
          <p className="text-muted-foreground mt-2">Your Official Donation Receipts</p>
        </div>

        {invoices.length === 0 ? (
          <p className="text-center text-muted-foreground">No invoices found for this date.</p>
        ) : (
          <div className="space-y-10">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white shadow-lg overflow-x-auto">
                <InvoicePrintTemplate 
                  devotee={sharedLink.Devotee} 
                  invoice={invoice} 
                  amount={invoice.amount} 
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 no-print">
          <button 
            className="bg-primary text-primary-foreground px-8 py-3 rounded-none font-label-caps uppercase tracking-widest text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined">print</span>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
