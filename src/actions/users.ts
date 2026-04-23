"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const getSupabaseAdmin = () => createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Helper to check if current user is ADMIN
async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN") throw new Error("Forbidden");
  
  return user;
}

export async function getUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(email: string, username: string, role: Role, password?: string) {
  await requireAdmin();
  const supabaseAdmin = getSupabaseAdmin();

  // 1. Create in Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: password || "ChangeMe123!",
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create user in Auth: ${error.message}`);
  }

  // 2. Create in Prisma
  const newUser = await prisma.user.create({
    data: {
      id: data.user.id,
      email,
      username,
      role,
    },
  });

  revalidatePath("/dashboard/admin/users");
  return newUser;
}

export async function deleteUserAccount(userId: string) {
  const currentUser = await requireAdmin();
  if (currentUser.id === userId) throw new Error("Cannot delete your own account");

  const supabaseAdmin = getSupabaseAdmin();

  // Delete in Prisma first to avoid foreign key issues if strict
  await prisma.user.delete({ where: { id: userId } });

  // Delete in Supabase Auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`Failed to delete user in Auth: ${error.message}`);
  }

  revalidatePath("/dashboard/admin/users");
}

export async function resetUserPassword(userId: string, newPassword?: string) {
  await requireAdmin();
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword || "ResetPassword123!",
  });

  if (error) {
    throw new Error(`Failed to reset password: ${error.message}`);
  }

  return { success: true };
}
