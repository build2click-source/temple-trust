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

export async function createDevotee(name: string, phone: string | null, city?: string, state?: string, pan?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const devotee = await prisma.devotee.create({
    data: {
      name,
      phone: phone || null,
      pan: pan || null,
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

export async function generateDonationInvoices(totalAmount: number, devoteeId: string, purpose: string, signature?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("Unauthorized");

  const cashierId = user.id;
  const CURRENT_DAY = new Date();

  // Ensure the user exists in our User table (Supabase sync check)
  await prisma.user.upsert({
    where: { id: cashierId },
    update: {},
    create: {
      id: cashierId,
      email: user.email!,
      role: "CLERK" // Default role for auto-synced users
    }
  });

  let remainingAmount = totalAmount;
  const splitAmounts: number[] = [];

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
      data: { devoteeId, cashierId, totalAmount, date: CURRENT_DAY, purpose, signature: signature || null },
    });

    // Get the true maximum numeric invoice number to avoid string sorting issues (e.g., "9" > "10")
    const maxResult = await tx.$queryRaw<[{ max: number }]>`
      SELECT MAX(CAST("invoiceNum" AS INTEGER)) as max 
      FROM "Invoice" 
      WHERE "invoiceNum" ~ '^[0-9]+$'
    `;
    
    let lastNum = maxResult[0]?.max || 0;

    const invoiceData = splitAmounts.map((amt, index) => ({
      donationId: newDonation.id,
      amount: amt,
      invoiceNum: (lastNum + index + 1).toString(),
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
  revalidatePath("/dashboard/ledger");
  return donation;
}

export async function getLedger(startDate?: string, endDate?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const whereClause: any = {};
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = new Date(startDate);
    if (endDate) whereClause.date.lte = new Date(endDate);
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
    take: 500, // Increased for range views
  });

  return donations;
}

export async function getStats(startDate?: string, endDate?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  // Global totals (Collected only)
  const globalAmountResult = await prisma.donation.aggregate({
    where: { status: "COLLECTED" },
    _sum: { totalAmount: true }
  });

  // Monthly totals
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyAmountResult = await prisma.donation.aggregate({
    where: {
      date: { gte: firstDayOfMonth },
      status: "COLLECTED"
    },
    _sum: { totalAmount: true }
  });

  // Date range specific
  const rangeWhere: any = { status: "COLLECTED" };
  if (start || end) {
    rangeWhere.date = {};
    if (start) rangeWhere.date.gte = start;
    if (end) rangeWhere.date.lte = end;
  }

  const rangeAmountResult = await prisma.donation.aggregate({
    where: rangeWhere,
    _sum: { totalAmount: true }
  });

  const rangeInvoicesResult = await prisma.invoice.count({
    where: {
      Donation: rangeWhere
    }
  });

  const totalDevoteesResult = await prisma.devotee.count();

  return {
    totalAmount: globalAmountResult._sum.totalAmount || 0,
    monthlyAmount: monthlyAmountResult._sum.totalAmount || 0,
    rangeAmount: rangeAmountResult?._sum.totalAmount || 0,
    totalInvoices: rangeInvoicesResult,
    totalDevotees: totalDevoteesResult
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

  revalidatePath("/dashboard");
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

export async function updateDevotee(id: string, data: { name: string, phone: string | null, city?: string, state?: string, pan?: string }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const devotee = await prisma.devotee.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone || null,
      pan: data.pan || null,
      city: data.city || null,
      state: data.state || null,
    },
  });

  revalidatePath("/dashboard/devotees");
  return devotee;
}

export async function deleteDevotee(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if devotee has donations (optional: could also use onCascadeDelete in prisma)
  const devotee = await prisma.devotee.delete({
    where: { id },
  });

  revalidatePath("/dashboard/devotees");
  return devotee;
}
