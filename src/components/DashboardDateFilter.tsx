"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

export function DashboardDateFilter({ initialDate }: { initialDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-card border border-border p-2 flex items-center gap-3">
      <span className="font-label-caps text-[10px] text-muted-foreground ml-2">Select Date</span>
      <div className="flex items-center gap-2">
         <input 
           type="date" 
           name="date"
           defaultValue={initialDate}
           className="bg-transparent border-none text-sm font-data-tabular focus:ring-0 cursor-pointer"
           onChange={(e) => handleDateChange(e.target.value)}
         />
      </div>
    </div>
  );
}
