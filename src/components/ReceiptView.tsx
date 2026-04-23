"use client";

import { format } from "date-fns";
import { numberToWords } from "@/lib/numberToWords";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ReceiptViewProps {
  donation: any;
  invoices: any[];
  showPrintButton?: boolean;
}

export function ReceiptView({ donation, invoices, showPrintButton = true }: ReceiptViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12">
      <style>
        {`
          @media print {
            @page {
              margin: 0mm;
              size: A4 portrait;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
            }
            header, footer, .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      {/* Stack of Receipts */}
      <div className="space-y-12 print:space-y-0">
        {invoices.map((inv: any, idx: number) => (
          <div key={inv.id} className={cn(
            "bg-white border-2 border-[#333] p-8 md:p-10 font-sans text-[#333] relative overflow-hidden mx-auto max-w-[800px] shadow-xl print:shadow-none print:max-w-[100%] print:h-[280mm] print:border-[2px] print:border-black print:m-0 print:p-12 print:break-after-page print:page-break-after-always",
            idx > 0 && "print:break-before-page mt-12 print:mt-0"
          )}>
             {/* Cancelled Watermark */}
             {donation.status === 'CANCELLED' && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                 <div className="border-[10px] border-destructive text-destructive px-20 py-10 text-[100px] font-black uppercase opacity-20 -rotate-45 tracking-[0.2em] select-none">
                   CANCELLED
                 </div>
               </div>
             )}
             {/* Official Header */}
             <div className="text-center mb-6 md:mb-10 border-b-2 border-double border-[#333] pb-6 md:pb-8">
                <div className="flex justify-center mb-4">
                   <img src="/logo.jpg?v=1.0" alt="Logo" className="h-24 w-auto object-contain" onError={(e) => e.currentTarget.src = "https://placehold.co/100x100?text=LOGO"} />
                </div>
                <h2 className="font-bold text-2xl md:text-3xl tracking-tight uppercase mb-2">{siteConfig.name}</h2>
                <p className="text-[10px] md:text-[12px] mb-1 font-bold">Regd No : {siteConfig.regdNo} | PAN No. {siteConfig.panNo}</p>
                <p className="text-[10px] md:text-[12px] mb-1">{siteConfig.address}</p>
                <p className="text-[10px] md:text-[12px]">Contact : {siteConfig.contact.phone} | Email : {siteConfig.contact.email}</p>
                
                <div className="mt-6 inline-block border-2 border-[#333] px-10 py-1 font-bold tracking-[0.4em] text-lg">RECEIPT</div>
             </div>

             {/* Receipt Fields */}
             <div className="space-y-6 text-md md:text-lg">
                <div className="flex justify-between items-baseline">
                   <div className="flex items-baseline">
                      <span className="font-bold mr-2">No :</span>
                      <span className="border-b border-dotted border-[#333] min-w-[80px] md:min-w-[100px] italic">{inv.invoiceNum.split('-').pop()}</span>
                   </div>
                   <div className="flex items-baseline">
                      <span className="font-bold mr-2">Date :</span>
                      <span className="border-b border-dotted border-[#333] min-w-[120px] md:min-w-[150px] italic">{format(new Date(donation.date), 'dd-MM-yyyy')}</span>
                   </div>
                </div>

                <div className="flex items-baseline">
                   <span className="font-bold mr-2 whitespace-nowrap">Shri / Smt. :</span>
                   <span className="flex-1 border-b border-dotted border-[#333] font-bold uppercase tracking-wide truncate">{donation.Devotee.name}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
                  <div className="flex items-baseline flex-1 w-full">
                     <span className="font-bold mr-2">Address :</span>
                     <span className="flex-1 border-b border-dotted border-[#333] uppercase text-xs truncate">{donation.Devotee.city}, {donation.Devotee.state}</span>
                  </div>
                  <div className="flex items-baseline w-full md:w-auto">
                     <span className="font-bold mr-2">PAN No. :</span>
                     <span className="border-b border-dotted border-[#333] min-w-[150px] uppercase font-bold">{donation.Devotee.pan || ""}</span>
                  </div>
                </div>

                <div className="flex items-baseline">
                   <span className="font-bold mr-2 whitespace-nowrap">Amount in Words :</span>
                   <span className="flex-1 border-b border-dotted border-[#333] italic text-sm md:text-md">Rupees {numberToWords(inv.amount)}</span>
                </div>

                <div className="flex items-baseline">
                   <span className="font-bold mr-2">Mobile No. :</span>
                   <span className="flex-1 border-b border-dotted border-[#333] font-data-tabular">{donation.Devotee.phone}</span>
                </div>

                <div className="flex items-baseline">
                   <span className="font-bold mr-2">Purpose :</span>
                   <span className="flex-1 border-b border-dotted border-[#333] font-bold">{donation.purpose}</span>
                </div>

                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="inline-flex items-center border-2 border-[#333] p-4 pr-16 bg-muted/5">
                      <span className="font-bold mr-6 bg-[#333] text-white px-3 py-2 text-xl">Amount</span>
                      <span className="font-bold text-3xl font-data-tabular text-[#333]">Rs. {inv.amount.toLocaleString()}.00</span>
                   </div>
                   
                   <div className="text-right italic text-[11px] max-w-[200px] flex flex-col items-center">
                      {donation.signature ? (
                        <div className="flex flex-col items-center">
                          <img src={donation.signature} alt="Signature" className="h-10 w-auto object-contain mb-1" />
                          <p className="font-bold border-t border-[#333] pt-1 w-full text-center">Authorised Signatory</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold border-t border-[#333] pt-2 mt-8 md:mt-12">Authorised Signatory</p>
                          <p className="mt-1">Computer generated receipt, no signature required</p>
                        </>
                      )}
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {showPrintButton && (
        <div className="flex justify-center pb-20 print:hidden">
          <button 
            onClick={handlePrint}
            className="bg-primary text-white py-4 px-12 font-heading text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-4"
          >
            <span className="material-symbols-outlined">print</span>
            PRINT ALL RECEIPTS
          </button>
        </div>
      )}
    </div>
  );
}
