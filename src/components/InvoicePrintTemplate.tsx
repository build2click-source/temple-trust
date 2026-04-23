import { siteConfig } from "@/config/site";
import { format } from "date-fns";

export default function InvoicePrintTemplate({ devotee, invoice, amount }: { devotee: any, invoice: any, amount: number }) {
  return (
    <div className="p-8 border-2 border-black max-w-2xl mx-auto bg-white text-black font-sans">
      <div className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider font-heading">
          {siteConfig.name}
        </h1>
        <p className="text-sm mt-1 font-semibold text-gray-700 font-label-caps tracking-widest">
          Official Donation Receipt
        </p>
        <p className="text-xs mt-2 text-gray-500">
          {siteConfig.contact.phone} | {siteConfig.contact.email}
        </p>
      </div>
      
      <div className="flex justify-between mb-8 border-b border-gray-300 pb-6">
        <div>
          <p className="mb-2"><strong className="font-label-caps text-xs text-gray-500 block mb-1">Receipt No:</strong> <span className="font-data-tabular text-lg">{invoice?.invoiceNum || 'TKT-PREVIEW'}</span></p>
          <p><strong className="font-label-caps text-xs text-gray-500 block mb-1">Devotee:</strong> <span className="font-bold text-lg">{devotee?.name || 'Awaiting Selection'}</span></p>
          {devotee?.phone && <p className="text-sm text-gray-600 mt-1">{devotee.phone}</p>}
        </div>
        <div className="text-right">
          <p className="mb-2"><strong className="font-label-caps text-xs text-gray-500 block mb-1">Date:</strong> <span className="font-data-tabular">{invoice?.date ? format(new Date(invoice.date), 'dd MMM yyyy') : format(new Date(), 'dd MMM yyyy')}</span></p>
          <div className="bg-gray-100 p-3 inline-block rounded-sm mt-2 border border-gray-300">
             <p className="font-label-caps text-[10px] text-gray-500 mb-1">Amount</p>
             <p className="font-heading text-2xl font-bold">₹{amount}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <p className="text-sm leading-relaxed text-gray-800">
          Received with thanks from <strong>{devotee?.name || '______________________'}</strong> a sum of <strong>₹{amount}</strong> towards temple donation / pooja seva. 
        </p>
      </div>
      
      <div className="flex justify-between mt-16 pt-8 border-t border-black border-dashed">
        <div className="text-center">
          <p className="font-label-caps text-xs text-gray-500 border-t border-gray-400 pt-2 w-32 mx-auto">Devotee Signature</p>
        </div>
        <div className="text-center">
          <p className="font-label-caps text-xs text-gray-500 border-t border-gray-400 pt-2 w-32 mx-auto">Authorized Signatory</p>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="font-heading italic text-xs text-gray-500">"May the divine grace illuminate your path."</p>
      </div>
    </div>
  );
}
