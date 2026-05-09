import prisma from "@/lib/prisma";

function getProgramPrefix(program?: string | null) {
  const value = (program || "").toLowerCase();

  if (value.includes("offshore")) return "OFF";
  if (value.includes("yelkenli")) return "YES";
  if (value.includes("icc")) return "ICC";
  if (value.includes("vhf")) return "SRC";
  if (value.includes("src")) return "SRC";

  return "GEN";
}

export async function generateCertificateId(program?: string | null) {
  const prefix = getProgramPrefix(program);
  const year = new Date().getFullYear();
  const startsWith = `AS-${prefix}-${year}-`;

  const lastReservation = await prisma.reservation.findFirst({
    where: {
      certificateId: {
        startsWith,
      },
    },
    orderBy: {
      certificateId: "desc",
    },
    select: {
      certificateId: true,
    },
  });

  let nextNumber = 1;

  if (lastReservation?.certificateId) {
    const parts = lastReservation.certificateId.split("-");
    const lastPart = parts[parts.length - 1];
    const parsed = Number.parseInt(lastPart, 10);

    if (!Number.isNaN(parsed)) {
      nextNumber = parsed + 1;
    }
  }

  const padded = String(nextNumber).padStart(4, "0");

  return `AS-${prefix}-${year}-${padded}`;
}