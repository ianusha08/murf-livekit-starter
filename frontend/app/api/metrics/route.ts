import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

function resolveDbPath(): string {
  const candidates = [
    path.resolve(process.cwd(), "..", "backend", "learner_memory.db"),
    path.resolve(process.cwd(), "backend", "learner_memory.db"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

const DB_PATH = resolveDbPath();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ total: 0, successful: 0, failed: 0 });
    }

    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

    const data = await new Promise<{ total: number; successful: number; failed: number }>(
      (resolve, reject) => {
        db.get(
          `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN outcome = 'success' THEN 1 ELSE 0 END) AS successful,
          SUM(CASE WHEN outcome = 'failure' THEN 1 ELSE 0 END) AS failed
        FROM call_outcomes
        `,
          (err, row: { total?: number; successful?: number; failed?: number }) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                total: row?.total ?? 0,
                successful: row?.successful ?? 0,
                failed: row?.failed ?? 0,
              });
            }
          }
        );
      }
    );

    db.close();

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.warn("[/api/metrics] Could not query DB at", DB_PATH, err);
    return NextResponse.json({ total: 0, successful: 0, failed: 0 });
  }
}
