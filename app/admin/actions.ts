"use server";

export async function createCertificateAction(data: {
  fullName: string;
  program: string;
  qualificationLevel: string;
  issueDate: string;
  seaMiles: string;
  photoUrl: string | null;
  instructorId: string;
}) {
  const { default: prisma } = await import("@/lib/prisma");

  const certificateId = `AS-${Date.now()}`;

  const certificate = await prisma.certificate.create({
    data: {
      certificateId,
      fullName: data.fullName,
      program: data.program,
      qualificationLevel: data.qualificationLevel,
      issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
      seaMiles: data.seaMiles ? Number(data.seaMiles) : 0,
      photoUrl: data.photoUrl,
      instructorId: data.instructorId,
      status: "PENDING",
    },
  });

  return certificate;
}