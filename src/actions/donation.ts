"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

function generateUniqueInvoiceNumber() {
  const dateStr = format(new Date(), "yyyyMMdd");
  const randomStr = randomBytes(3).toString("hex").toUpperCase();
  return `TKT-${dateStr}-${randomStr}`;
}

export async function createDevotee(name: string, phone: string | null, city?: string, state?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const devotee = await prisma.devotee.create({
    data: {
      name,
      phone: phone || null,
      city: city || null,
      state: state || null,
    },
  });

  return devotee;
}

export async function searchDevotees(query: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const devotees = await prisma.devotee.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { phone: { contains: query } },
      ],
    },
    take: 10,
  });

  return devotees;
}

export async function generateDonationInvoices(totalAmount: number, devoteeId: string, purpose: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("Unauthorized");

  const cashierId = user.id;
  const CURRENT_DAY = new Date();

  let remainingAmount = totalAmount;
  const splitAmounts = [];

  // Logic to split by 2000
  while (remainingAmount > 0) {
    if (remainingAmount >= 2000) {
      splitAmounts.push(2000);
      remainingAmount -= 2000;
    } else {
      splitAmounts.push(remainingAmount);
      remainingAmount = 0;
    }
  }

  // Database Transaction to ensure all or nothing saves
  const donation = await prisma.$transaction(async (tx) => {
    const newDonation = await tx.donation.create({
      data: { devoteeId, cashierId, totalAmount, date: CURRENT_DAY, purpose },
    });

    const invoiceData = splitAmounts.map((amt) => ({
      donationId: newDonation.id,
      amount: amt,
      invoiceNum: generateUniqueInvoiceNumber(),
      date: CURRENT_DAY,
    }));

    await tx.invoice.createMany({ data: invoiceData });

    // Create a public shared link for this donation
    const sharedLink = await tx.sharedLink.create({
      data: {
        donationId: newDonation.id,
        devoteeId: devoteeId,
      }
    });

    return { ...newDonation, sharedLink };
  });

  revalidatePath("/dashboard");
  return donation;
}

export async function getLedger(date?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const whereClause: any = {};
  if (date) {
    whereClause.date = new Date(date);
  }

  const donations = await prisma.donation.findMany({
    where: whereClause,
    include: {
      Devotee: true,
      Cashier: true,
      Invoices: true,
      SharedLinks: true,
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  return donations;
}

export async function getStats() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const totalAmountResult = await prisma.donation.aggregate({
    where: { status: "COLLECTED" },
    _sum: { totalAmount: true }
  });

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const monthlyAmountResult = await prisma.donation.aggregate({
    where: {
      date: { gte: firstDayOfMonth },
      status: "COLLECTED"
    },
    _sum: { totalAmount: true }
  });

  return {
    total: totalAmountResult._sum.totalAmount || 0,
    monthly: monthlyAmountResult._sum.totalAmount || 0
  };
}

export async function cancelDonation(donationId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const donation = await prisma.donation.update({
    where: { id: donationId },
    data: { status: "CANCELLED" }
  });

  revalidatePath("/dashboard/ledger");
  return donation;
}

export async function getAllDevotees() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const devotees = await prisma.devotee.findMany({
    include: {
      _count: {
        select: { Donations: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return devotees;
}
