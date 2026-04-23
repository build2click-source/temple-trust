"use client";

import { useState } from "react";
import { format } from "date-fns";
import { numberToWords } from "@/lib/numberToWords";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { cancelDonation } from "@/actions/donation";
import { useRouter } from "next/navigation";
import { ReceiptView } from "./ReceiptView";

interface LedgerClientProps {
  initialDonations: any[];
  stats: { total: number; monthly: number };
}

export function LedgerClient({ initialDonations, stats }: LedgerClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [donations, setDonations] = useState(initialDonations);
  const [viewingDonation, setViewingDonation] = useState<any | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this divine offering? This cannot be undone.")) return;
    setIsCancelling(id);
    try {
      await cancelDonation(id);
      router.refresh();
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'CANCELLED' } : d));
    } catch (err) {
      alert("Failed to cancel offering.");
    } finally {
      setIsCancelling(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = (donation: any, invoiceNum?: string, amt?: number) => {
    if (!donation.Devotee.phone) {
      alert("No phone number found.");
      return;
    }
    const cleanPhone = donation.Devotee.phone.replace(/\D/g, "");
    const shareAmt = amt || donation.totalAmount;
    const shareNum = invoiceNum || "All Receipts";
    
    const shareUrl = donation.SharedLinks?.[0]?.id 
      ? `${window.location.origin}/share/${donation.SharedLinks[0].id}` 
      : "";

    const message = encodeURIComponent(
      `Namaste ${donation.Devotee.name}! 🙏\n\nThank you for your offering of ₹${shareAmt} for ${donation.purpose} at ${siteConfig.name}.\n\n${shareUrl ? `View/Download your receipts here: ${shareUrl}\n\n` : ""}Date: ${format(new Date(donation.date), "dd MMM yyyy")}\n\nMay the divine grace be with you.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card border-2 border-border p-8 shadow-sm">
          <p className="font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Total Collection (Till Now)</p>
          <h3 className="font-heading text-4xl text-primary">₹{stats.total.toLocaleString()}</h3>
        </div>
        <div className="bg-card border-2 border-primary/20 p-8 shadow-md">
          <p className="font-label-caps text-[10px] text-primary uppercase tracking-widest mb-2">Monthly Summary ({format(new Date(), 'MMM yyyy')})</p>
          <h3 className="font-heading text-4xl text-primary">₹{stats.monthly.toLocaleString()}</h3>
        </div>
        <div className="bg-card border-2 border-border p-8 shadow-sm flex flex-col justify-center">
          <p className="font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Filter by Date</p>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-transparent border-b-2 border-border focus:border-primary transition-colors py-1 outline-none font-data-tabular"
          />
        </div>
      </div>

      <div className="bg-card border-2 border-border overflow-visible shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b-2 border-border">
              <th className="p-6 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Date</th>
              <th className="p-6 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Devotee</th>
              <th className="p-6 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest">Purpose</th>
              <th className="p-6 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest text-right">Amount</th>
              <th className="p-6 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest text-center">Status</th>
              <th className="p-6 font-label-caps text-[10px] text-muted-foreground uppercase tracking-widest text-center">Invoices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {donations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center text-muted-foreground font-heading italic">
                  No offerings recorded for this period.
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id} className={cn(
                  "hover:bg-primary/5 transition-colors group",
                  donation.status === 'CANCELLED' && "opacity-50 grayscale bg-muted/20"
                )}>
                  <td className="p-6 font-data-tabular text-sm">
                    {format(new Date(donation.date), "dd MMM yyyy")}
                  </td>
                  <td className="p-6">
                    <p className={cn("font-heading text-md text-foreground", donation.status === 'CANCELLED' && "line-through")}>{donation.Devotee.name}</p>
                    <p className="text-[10px] text-muted-foreground font-data-tabular">{donation.Devotee.phone || "No phone"}</p>
                  </td>
                  <td className="p-6 text-sm italic text-muted-foreground">
                    {donation.purpose}
                  </td>
                  <td className="p-6 text-right">
                    <span className={cn("font-heading text-xl text-primary font-bold", donation.status === 'CANCELLED' && "line-through opacity-50")}>₹{donation.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="p-6 text-center">
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-label-caps tracking-widest border",
                      donation.status === 'CANCELLED' ? "border-destructive text-destructive bg-destructive/5" : "border-green-600 text-green-600 bg-green-50"
                    )}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="p-6 relative">
                    <div className="flex justify-center gap-2">
                       <button 
                        onClick={() => setViewingDonation(donation)}
                        className="p-2 hover:bg-primary/10 text-primary transition-colors border border-primary/20"
                        title="View Official Receipt"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>

                      {donation.status !== 'CANCELLED' && (
                        <button 
                          onClick={() => handleCancel(donation.id)}
                          disabled={isCancelling === donation.id}
                          className="p-2 hover:bg-destructive/10 text-destructive transition-colors border border-destructive/20"
                          title="Cancel Offering"
                        >
                          <span className="material-symbols-outlined">cancel</span>
                        </button>
                      )}

                      <div className="relative">
                        <button 
                          onClick={() => setExpandedId(expandedId === donation.id ? null : donation.id)}
                          disabled={donation.status === 'CANCELLED'}
                          className={cn(
                            "p-2 flex items-center gap-1 transition-all border",
                            expandedId === donation.id ? "bg-primary text-white border-primary" : "hover:bg-primary/10 text-primary border-primary/20"
                          )}
                        >
                          <span className="material-symbols-outlined">receipt_long</span>
                          <span className="text-xs font-bold">{donation.Invoices.length}</span>
                          <span className="material-symbols-outlined text-xs">
                            {expandedId === donation.id ? "expand_less" : "expand_more"}
                          </span>
                        </button>

                        {expandedId === donation.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setExpandedId(null)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-64 bg-card border-2 border-primary shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="p-3 border-b border-border bg-muted/30">
                                <p className="text-[10px] font-label-caps text-muted-foreground uppercase tracking-widest">Available Invoices</p>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {donation.Invoices.map((inv: any) => (
                                  <div key={inv.id} className="p-4 border-b border-border last:border-0 hover:bg-primary/5 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-data-tabular text-xs font-bold text-foreground">#{inv.invoiceNum.split('-').pop()}</span>
                                      <span className="font-heading text-sm text-primary font-bold">₹{inv.amount}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                      <button 
                                        onClick={() => setViewingDonation({ ...donation, Invoices: [inv] })}
                                        className="py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-label-caps flex items-center justify-center gap-2 border border-primary/20"
                                      >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        VIEW
                                      </button>
                                      <button 
                                        onClick={() => handleShareWhatsApp(donation, inv.invoiceNum, inv.amount)}
                                        className="py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-[10px] font-label-caps flex items-center justify-center gap-2 border border-[#25D366]/20"
                                      >
                                        <span className="material-symbols-outlined text-sm">share</span>
                                        SHARE
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="p-3 bg-primary/5">
                                <button 
                                  onClick={() => handleShareWhatsApp(donation)}
                                  className="w-full py-3 bg-primary text-white font-heading text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                  <span className="material-symbols-outlined text-sm">ios_share</span>
                                  SHARE ALL ({donation.Invoices.length})
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt View Modal */}
      {viewingDonation && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300 print:bg-white print:p-0">
          <div className="bg-card border-2 border-primary max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl relative print:border-0 print:shadow-none print:max-h-none">
            <button 
              onClick={() => setViewingDonation(null)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-colors print:hidden"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <div className="p-10 lg:p-16 print:p-0">
              <div className="text-center mb-8 print:hidden">
                <h3 className="font-heading text-2xl text-primary mb-2">Recording Breakdown</h3>
                <p className="text-sm text-muted-foreground">This offering was split into {viewingDonation.Invoices.length} receipts.</p>
              </div>

              <ReceiptView donation={viewingDonation} invoices={viewingDonation.Invoices} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
