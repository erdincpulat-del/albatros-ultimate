import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

type Params = {
  fullName: string
  qualification: string
  certificateId: string
  issueDate?: Date | string | null
  qrCodeDataUrl: string
}

export async function generateCertificateA4({
  fullName,
  qualification,
  certificateId,
  issueDate,
  qrCodeDataUrl
}: Params) {

  const templatePath = path.join(
    process.cwd(),
    "public/certificate-templates/certificate-a4.png"
  )

  const outputDir = path.join(
    process.cwd(),
    "public/generated-certificates"
  )

  await fs.mkdir(outputDir, { recursive: true })

  const outputFile = `${certificateId}-certificate.png`
  const outputPath = path.join(outputDir, outputFile)

  const template = await fs.readFile(templatePath)

  const qr = Buffer.from(
    qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""),
    "base64"
  )

  const textSvg = Buffer.from(`
  <svg width="1240" height="1754">
  <style>
  .name{font-size:54px;font-weight:700;font-family:Arial}
  .title{font-size:60px;font-weight:700;font-family:Arial}
  .qual{font-size:42px;font-weight:700;font-family:Arial}
  .meta{font-size:24px;font-family:Arial}
  </style>

  <text x="220" y="200" class="title">CERTIFICATE OF COMPLETION</text>

  <text x="260" y="500" class="meta">This certifies that</text>

  <text x="180" y="650" class="name">${fullName}</text>

  <text x="260" y="760" class="meta">has successfully completed</text>

  <text x="220" y="860" class="qual">${qualification}</text>

  <text x="460" y="1350" class="meta">
  Certificate ID ${certificateId}
  </text>

  </svg>
  `)

  await sharp(template)
    .composite([
      { input: textSvg, top: 0, left: 0 },
      { input: qr, top: 150, left: 1020 }
    ])
    .png()
    .toFile(outputPath)

  return `/generated-certificates/${outputFile}`
}