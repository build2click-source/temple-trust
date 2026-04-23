"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function createShareToken(devoteeId: string, date: Date) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const sharedLink = await prisma.sharedLink.create({
    data: {
      devoteeId,
      date,
      // Optional: Add expiration
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  return sharedLink.token;
}
