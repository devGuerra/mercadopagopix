import crypto from "node:crypto";

export function generateRandomHash(length = 64): string {
  const randomBytes = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(randomBytes).digest("hex");
  return hash.slice(0, length);
}
