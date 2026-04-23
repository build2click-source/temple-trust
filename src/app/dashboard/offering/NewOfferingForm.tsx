"use client";

import { useState, useEffect } from "react";
import { searchDevotees, createDevotee, generateDonationInvoices } from "@/actions/donation";
import { siteConfig } from "@/config/site";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { numberToWords } from "@/lib/numberToWords";
import { ReceiptView } from "@/components/ReceiptView";

const PURPOSES = [
  "Akhand Jyoti (1 Month)",
  "Akhand Jyoti (1 year)",
  "Bhadimavas Donation",
  "Bhandara Seva",
  "Bhandara Seva (Churma)",
  "Bhandara Seva (Other)",
  "Bhandara Seva (Sawamani)",
  "Dadi Gulak",
  "Dadi's Photo",
  "Dharamshala Seva",
  "Gau Seva",
  "Gua Seva - Tula Daan",
  "Kabootar Seva",
  "Mandir Seva",
  "Miscellaneous Donation",
  "Other Donation",
  "Parojan Donation",
  "Sharad Utsav",
  "Shringar & Bhog",
  "Shringar Seva",
  "Special pooja",
  "Turant Balaji Jyoti"
];

export default function NewOfferingForm() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(1000);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [devotees, setDevotees] = useState<any[]>([]);
  const [selectedDevotee, setSelectedDevotee] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  const [newDevoteeName, setNewDevoteeName] = useState("");
  const [newDevoteePhone, setNewDevoteePhone] = useState("");
  const [newDevoteeCity, setNewDevoteeCity] = useState("");
  const [newDevoteeState, setNewDevoteeState] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchDevotees(searchQuery);
          setDevotees(results);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setDevotees([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCreateDevotee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dev = await createDevotee(newDevoteeName, newDevoteePhone, newDevoteeCity, newDevoteeState);
      setSelectedDevotee(dev);
      setShowCreateModal(false);
      setSearchQuery("");
      setNewDevoteeName("");
      setNewDevoteePhone("");
      setNewDevoteeCity("");
      setNewDevoteeState("");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Unique constraint")) {
        alert("A devotee with this phone number already exists.");
      } else {
        alert("Failed to create devotee profile.");
      }
    }
  };

  const handleProcessOffering = async () => {
    if (!selectedDevotee) return;
    setIsSubmitting(true);
    try {
      const donation = await generateDonationInvoices(amount, selectedDevotee.id, purpose);
      setSuccessData(donation);
    } catch (err) {
      console.error(err);
      alert("Failed to process offering.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const splitAmounts = [];
  let remaining = amount;
  while (remaining > 0) {
    if (remaining >= 2000) {
      splitAmounts.push(2000);
      remaining -= 2000;
    } else {
      splitAmounts.push(remaining);
      remaining = 0;
    }
  }

  const handleShareWhatsApp = (invoiceNum: string, amt: number) => {
    if (!selectedDevotee?.phone) {
      alert("No phone number found.");
      return;
    }
    const cleanPhone = selectedDevotee.phone.replace(/\D/g, "");
    const shareUrl = successData?.sharedLink?.id 
      ? `${window.location.origin}/share/${successData.sharedLink.id}` 
      : "";

    const message = encodeURIComponent(
      `Namaste ${selectedDevotee.name}! 🙏\n\nThank you for your offering of ₹${amt} for ${purpose} at Shree Ked Shaktidham Samity Ked.\n\n${shareUrl ? `View/Download your receipts here: ${shareUrl}\n\n` : ""}May the divine grace be with you.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-4xl text-foreground">Sacred Ledger Entry</h1>
        <p className="text-muted-foreground mt-2 font-body-md italic text-lg">"Dharmo Rakshati Rakshitah"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Devotee Identification Card */}
        <section className="bg-card border-2 border-border p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 wavy-line -mr-16 -mt-16 rotate-45 pointer-events-none opacity-10"></div>
          <h2 className="font-label-caps text-xs text-primary mb-8 uppercase tracking-[0.2em] font-bold">I. Devotee Registry</h2>
          
          <div className="space-y-6">
            {!selectedDevotee ? (
              <div className="relative">
                <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase">Search Name or Mobile</label>
                <div className="flex items-center border-b-2 border-border focus-within:border-primary transition-colors py-3">
                  <span className="material-symbols-outlined text-muted-foreground mr-3">search</span>
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 font-heading text-lg p-0 outline-none placeholder:text-muted-foreground/30" 
                    placeholder="Search..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {searchQuery.length >= 2 && (
                  <div className="absolute z-50 w-full mt-2 bg-card border-2 border-primary shadow-2xl">
                    {isSearching ? (
                      <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Searching registry...</div>
                    ) : devotees.length > 0 ? (
                      <ul className="max-h-80 overflow-y-auto">
                        {devotees.map(d => (
                          <li 
                            key={d.id} 
                            className="p-5 hover:bg-primary/5 cursor-pointer flex justify-between items-center border-b border-border last:border-0 group"
                            onClick={() => {
                              setSelectedDevotee(d);
                              setSearchQuery("");
                            }}
                          >
                            <div>
                              <span className="font-heading text-lg text-foreground block group-hover:text-primary transition-colors">{d.name}</span>
                              <span className="text-muted-foreground font-data-tabular text-sm">{d.phone || "No phone"} {d.city ? `• ${d.city}` : ""}</span>
                            </div>
                            <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                          </li>
                        ))}
                        <li 
                          className="p-5 bg-primary text-white hover:bg-primary/90 cursor-pointer font-bold flex items-center justify-center gap-3"
                          onClick={() => setShowCreateModal(true)}
                        >
                          <span className="material-symbols-outlined">person_add</span>
                          REGISTER NEW DEVOTEE
                        </li>
                      </ul>
                    ) : (
                      <div className="p-8 text-center space-y-4">
                        <p className="text-sm text-muted-foreground italic">No results found.</p>
                        <button 
                          className="w-full py-4 bg-primary text-white font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg"
                          onClick={() => {
                            setNewDevoteeName(searchQuery);
                            setShowCreateModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">person_add</span>
                          CREATE NEW PROFILE
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-primary/5 border-2 border-primary relative group">
                <p className="font-label-caps text-[10px] text-primary mb-2 uppercase font-bold tracking-widest">Devotee Selected</p>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading text-2xl text-foreground">{selectedDevotee.name}</h3>
                    <p className="font-data-tabular text-sm text-muted-foreground">{selectedDevotee.phone || "No phone"}</p>
                    <p className="font-body-md text-xs text-muted-foreground uppercase">{selectedDevotee.city}, {selectedDevotee.state}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedDevotee(null)}
                    className="p-2 hover:bg-primary/10 text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Offering Details Card */}
        <section className="bg-card border-2 border-border p-8 shadow-sm">
          <h2 className="font-label-caps text-xs text-primary mb-8 uppercase tracking-[0.2em] font-bold">II. Offering Details</h2>
          <div className="space-y-8">
            <div>
              <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase tracking-widest">Purpose of Donation</label>
              <select 
                className="w-full bg-transparent border-b-2 border-border focus:border-primary transition-colors py-3 outline-none font-heading text-lg appearance-none cursor-pointer"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase tracking-widest">Amount (₹)</label>
              <div className="flex items-baseline border-b-2 border-border focus-within:border-primary transition-colors py-2">
                <span className="font-heading text-4xl text-primary mr-4">₹</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 font-heading text-4xl text-foreground p-0 outline-none" 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <button 
              onClick={() => setShowPreviewModal(true)}
              disabled={!selectedDevotee || amount <= 0}
              className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-30 transition-all py-6 px-6 font-heading text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group"
            >
              PREVIEW RECEIPT
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">visibility</span>
            </button>
          </div>
        </section>
      </div>

      {/* Preview Modal Overlay */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-card border-2 border-primary max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            <div className="p-8 lg:p-12">
              <div className="text-center mb-10">
                <p className="font-label-caps text-xs text-primary uppercase tracking-[0.3em] mb-4 font-bold">Review Divine Receipt</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 overflow-y-auto max-h-[600px] p-2">
                   <ReceiptView donation={{ date: new Date(), Devotee: selectedDevotee, purpose }} invoices={splitAmounts.map((amt, i) => ({ id: i, amount: amt, invoiceNum: 'TKT-PREVIEW' }))} showPrintButton={false} />
                </div>

                <div className="lg:col-span-4 space-y-8 flex flex-col justify-center">
                  <div className="bg-primary/5 p-8 border-l-4 border-primary space-y-4 shadow-sm">
                    <h4 className="font-heading text-xl text-primary">Summary</h4>
                    <div className="flex justify-between py-2 border-b border-primary/10">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-heading text-xl text-foreground">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-primary/10">
                      <span className="text-sm text-muted-foreground">Split</span>
                      <span className="font-heading text-xl text-foreground">{splitAmounts.length} Receipts</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleProcessOffering}
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-6 px-10 font-heading text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? "RECORDING..." : "CONFIRM & GENERATE"}
                    {!isSubmitting && <span className="material-symbols-outlined">check_circle</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal Overlay */}
      {successData && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-card border-4 border-primary max-w-4xl w-full p-10 lg:p-16 shadow-[0_0_100px_rgba(143,78,0,0.3)] relative text-center">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <span className="material-symbols-outlined text-5xl">verified</span>
            </div>
            
            <h2 className="font-heading text-4xl text-foreground mb-4">Offering Recorded!</h2>
            <p className="text-muted-foreground font-body-md text-lg mb-12">
               Receipt successfully generated for {selectedDevotee?.name}.
            </p>

            <div className="space-y-8 mb-12">
              <div className="p-4 bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="font-label-caps text-[9px] text-muted-foreground uppercase mb-1">Public Share Link</p>
                  <p className="text-xs font-data-tabular text-primary truncate max-w-[250px]">
                    {typeof window !== 'undefined' ? `${window.location.origin}/share/${successData.sharedLink.id}` : ''}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/share/${successData.sharedLink.id}`;
                    navigator.clipboard.writeText(url);
                    alert("Link copied!");
                  }}
                  className="p-2 hover:bg-primary/10 text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="p-6 bg-muted border border-border">
                  <p className="font-label-caps text-[10px] text-muted-foreground mb-1">TOTAL AMOUNT</p>
                  <p className="font-heading text-3xl text-primary">₹{successData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-muted border border-border">
                  <p className="font-label-caps text-[10px] text-muted-foreground mb-1">PURPOSE</p>
                  <p className="font-heading text-lg text-foreground truncate">{purpose}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-label-caps text-xs text-muted-foreground uppercase tracking-widest">Share with Devotee</h4>
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => handleShareWhatsApp("Receipt", amount)}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 font-heading flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20"
                >
                  <span className="material-symbols-outlined text-2xl">share</span>
                  SHARE VIA WHATSAPP
                </button>
                
                <button 
                  onClick={() => {
                    setSuccessData(null);
                    router.push("/dashboard");
                  }}
                  className="w-full bg-card border-2 border-border py-4 px-6 font-heading text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-card border-2 border-primary p-10 w-full max-w-md shadow-2xl">
            <h3 className="font-heading text-2xl text-primary mb-8 text-center">Register Devotee</h3>
            <form onSubmit={handleCreateDevotee} className="space-y-6">
              <div>
                <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase tracking-widest">Full Name</label>
                <input 
                  required
                  value={newDevoteeName}
                  onChange={e => setNewDevoteeName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border focus:border-primary transition-colors py-3 outline-none font-heading text-lg" 
                  placeholder="Shri / Smt."
                />
              </div>
              <div>
                <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase tracking-widest">Mobile Number</label>
                <input 
                  value={newDevoteePhone}
                  onChange={e => setNewDevoteePhone(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border focus:border-primary transition-colors py-3 outline-none font-data-tabular text-lg" 
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase tracking-widest">City</label>
                  <input 
                    value={newDevoteeCity}
                    onChange={e => setNewDevoteeCity(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border focus:border-primary transition-colors py-3 outline-none font-heading text-lg" 
                    placeholder="e.g. Kolkata"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[10px] text-muted-foreground block mb-2 uppercase tracking-widest">State</label>
                  <input 
                    value={newDevoteeState}
                    onChange={e => setNewDevoteeState(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border focus:border-primary transition-colors py-3 outline-none font-heading text-lg" 
                    placeholder="e.g. WB"
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 text-muted-foreground font-label-caps text-xs border-2 border-border hover:bg-muted">CANCEL</button>
                <button type="submit" className="flex-1 py-4 bg-primary text-white font-label-caps text-xs hover:bg-primary/90 shadow-lg shadow-primary/10">SAVE PROFILE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
