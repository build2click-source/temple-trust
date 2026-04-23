import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@temple.org";

  console.log(`Confirming email for user: ${email}...`);

  // Update the auth.users table directly to bypass email confirmation
  await prisma.$executeRawUnsafe(
    `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = $1`,
    email
  );

  console.log("Email confirmed successfully. You should now be able to log in.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
