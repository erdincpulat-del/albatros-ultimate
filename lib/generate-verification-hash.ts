import crypto from "crypto";

function normalizeId(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toUpperCase();
}

export function generateVerificationHash(
  certificateId: unknown,
  fullName?: unknown,
  issueDate?: unknown
): string {
  const id = normalizeId(certificateId);
  const name = normalizeId(fullName);
  const date = normalizeId(issueDate);

  const raw = `${id}|${name}|${date}`;

  return crypto.createHash("sha256").update(raw).digest("hex");
}