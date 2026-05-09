import prisma from "@/lib/prisma"
import QRCode from "qrcode"
import { generateCertificateCardFront } from "@/lib/generate-certificate-card-front"
import { generateCertificateCardBack } from "@/lib/generate-certificate-card-back"
import { generateCertificateId } from "@/lib/certificate"

export async function createCertificateWithCard(data: {
  fullName: string
  program: string
  qualificationLevel?: string
  seaMiles?: number
  issueDate: Date
  photoUrl?: string
  instructorId: string
}) {
  // 1. CERTIFICATE ID
  const certificateId = await generateCertificateId(data.program)

  // 2. CREATE CERTIFICATE
  const certificate = await prisma.certificate.create({
    data: {
      certificateId,
      fullName: data.fullName,
      program: data.program,
      qualificationLevel: data.qualificationLevel,
      seaMiles: data.seaMiles || 0,
      issueDate: data.issueDate,
      photoUrl: data.photoUrl || null,
      status: "PENDING",
      instructorId: data.instructorId,
    },
  })

  // 3. QR CODE
  const qrCodeDataUrl = await QRCode.toDataURL(
    `${process.env.NEXT_PUBLIC_APP_URL}/verify?certificateId=${certificateId}`
  )

  // 4. FRONT CARD
  const cardFrontUrl = await generateCertificateCardFront({
    certificateId,
    fullName: data.fullName,
    qualification:
      data.qualificationLevel || data.program || "Offshore Yacht Course",
    issueDate: data.issueDate,
    seaMiles: data.seaMiles,
    photoUrl: data.photoUrl,
  })

  // 5. BACK CARD
  const cardBackUrl = await generateCertificateCardBack({
    certificateId,
    qrCodeDataUrl,
  })

  // 6. UPDATE DB
  await prisma.certificate.update({
    where: { id: certificate.id },
    data: {
      cardFrontUrl,
      cardBackUrl,
      qrCodeUrl: qrCodeDataUrl,
      status: "ACTIVE",
    },
  })

  return {
    ...certificate,
    cardFrontUrl,
    cardBackUrl,
  }
}