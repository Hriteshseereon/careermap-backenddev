import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;
// Create the PostgreSQL client connection pool using the environment variable
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter required by Prisma 7
const adapter = new PrismaPg(pool);

// Instantiate the Prisma Client passing the adapter.
// Security: password hashes (and admin reset tokens) are never selected by default,
// so they cannot leak through any API response or nested `include`. Code that must
// check a password opts in explicitly with `omit: { password: false }`.
const prisma = new PrismaClient({
  adapter,
  omit: {
    users: { password: true },
    adminUsers: { password: true, resetToken: true, resetTokenExpiry: true },
    staffUser: { password: true },
    institutes: { password: true },
  },
});

// Ensure totalPercentage column exists on CounselingForm table
pool.query('ALTER TABLE "CounselingForm" ADD COLUMN IF NOT EXISTS "totalPercentage" TEXT;').catch((err) => {
  console.warn("Notice: could not auto-add totalPercentage column (it may already exist or table not created yet):", err.message);
});


export { pool };
export default prisma;
