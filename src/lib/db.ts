import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // If remote DATABASE_URL (e.g. Postgres / Turso / remote url) is set, prioritize it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // Serverless runtime detection (Vercel, AWS Lambda, or production Linux container)
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (process.env.NODE_ENV === "production" && process.platform !== "win32")
  );

  if (isServerless) {
    const tmpDbPath = "/tmp/dev.db";

    const candidateSources = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), "dev.db"),
      path.resolve("prisma/dev.db"),
      path.resolve("dev.db"),
    ];

    const foundSource = candidateSources.find((p) => {
      try {
        return fs.existsSync(p);
      } catch {
        return false;
      }
    });

    if (foundSource) {
      try {
        // Copy SQLite database to writable /tmp if not yet present
        if (!fs.existsSync(tmpDbPath)) {
          fs.copyFileSync(foundSource, tmpDbPath);
          console.log(`[DB] Successfully copied SQLite database from ${foundSource} to ${tmpDbPath}`);
        }
        return `file:${tmpDbPath}`;
      } catch (err) {
        console.error("[DB] Could not copy SQLite database to /tmp:", err);
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Local development fallback
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(localDb)) {
    return `file:${localDb}`;
  }

  return process.env.DATABASE_URL || "file:./prisma/dev.db";
}

const resolvedUrl = getDatabaseUrl();

// Ensure process.env.DATABASE_URL is defined for Prisma internals
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
  process.env.DATABASE_URL = resolvedUrl;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

