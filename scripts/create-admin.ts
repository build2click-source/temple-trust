import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" }); // Make sure to load DATABASE_URL

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@temple.org";
  const password = "AdminPassword123!";
  const username = "admin";

  console.log(`Creating admin user: ${email}...`);

  // 1. Create user in Supabase Auth using signUp (requires public signups to be enabled temporarily)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Error creating user in Supabase:", authError.message);
    console.error("If signups are disabled, you MUST provide SUPABASE_SERVICE_ROLE_KEY and use the admin API.");
    process.exit(1);
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error("Failed to retrieve user ID after signup.");
    process.exit(1);
  }
  console.log(`Supabase User created with ID: ${userId}`);

  // 2. Create user in Prisma DB
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      role: "ADMIN",
    },
    create: {
      id: userId,
      email,
      username,
      role: "ADMIN",
    },
  });

  console.log("Prisma User created:", user);
  console.log("Admin creation successful.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
