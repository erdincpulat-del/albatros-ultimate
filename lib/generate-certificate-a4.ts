import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type GenerateCertificateA4Params = {
  certificateId: string;
  fullName: string;
  qualification: string;
  issueDate?: string | Date | null;
  seaMiles?: number | null;
  photoUrl?: string | null;
  qrCodeDataUrl: string;
  verificationHash?: string | null;
  instructorName?: string | null;
};

function formatIssueDate(dateValue?: Date | string | null) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function loadPhotoBuffer(photoUrl?: string | null) {
  if (!photoUrl) return null;

  try {
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      const response = await fetch(photoUrl, { cache: "no-store" });
      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    let normalized = photoUrl.trim();

    if (normalized.startsWith("/")) normalized = normalized.slice(1);
    if (normalized.startsWith("public/")) {
      normalized = normalized.replace(/^public\//, "");
    }

    const absolutePath = path.join(process.cwd(), "public", normalized);
    return await fs.readFile(absolutePath);
  } catch {
    return null;
  }
}

function createA4TextSvg({
  width,
  height,
  fullName,
  qualification,
  certificateId,
  issueDate,
  seaMiles,
  verificationHash,
  instructorName,
}: {
  width: number;
  height: number;
  fullName: string;
  qualification: string;
  certificateId: string;
  issueDate?: string | Date | null;
  seaMiles?: number | null;
  verificationHash?: string | null;
  instructorName?: string | null;
}) {
  const safeFullName = escapeXml(fullName || "");
  const safeQualification = escapeXml(qualification || "");
  const safeCertificateId = escapeXml(certificateId || "");
  const safeIssueDate = escapeXml(formatIssueDate(issueDate));
  const safeSeaMiles =
    typeof seaMiles === "number" ? `${seaMiles} NM` : "-";
  const safeVerificationHash = escapeXml(verificationHash || "-");
  const safeInstructor = escapeXml(instructorName || "-");

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title {
          fill: #111827;
          font-size: 52px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .subtitle {
          fill: rgba(17,24,39,0.85);
          font-size: 24px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
        }
        .label {
          fill: rgba(17,24,39,0.70);
          font-size: 20px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
        }
        .name {
          fill: #111827;
          font-size: 44px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
        }
        .value {
          fill: #111827;
          font-size: 26px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
        }
        .footer {
          fill: rgba(17,24,39,0.8);
          font-size: 18px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
        }
      </style>

      <text x="200" y="180" class="title">ALBATROS SAILING</text>
      <text x="200" y="220" class="subtitle">Official Sailing Certificate</text>

      <text x="200" y="350" class="label">FULL NAME</text>
      <text x="200" y="400" class="name">${safeFullName}</text>

      <text x="200" y="480" class="label">QUALIFICATION</text>
      <text x="200" y="520" class="value">${safeQualification}</text>

      <text x="200" y="600" class="label">CERTIFICATE ID</text>
      <text x="200" y="640" class="value">${safeCertificateId}</text>

      <text x="200" y="720" class="label">ISSUE DATE</text>
      <text x="200" y="760" class="value">${safeIssueDate}</text>

      <text x="200" y="840" class="label">SEA MILES</text>
      <text x="200" y="880" class="value">${safeSeaMiles}</text>

      <text x="200" y="960" class="label">INSTRUCTOR</text>
      <text x="200" y="1000" class="value">${safeInstructor}</text>

      <text x="200" y="1080" class="label">VERIFICATION HASH</text>
      <text x="200" y="1120" class="value">${safeVerificationHash}</text>

      <text x="200" y="1500" class="footer">
        Scan QR to verify authenticity
      </text>

      <text x="200" y="1530" class="footer">
        Albatros Sailing • Bodrum / Türkiye
      </text>
    </svg>
  `);
}

export async function generateCertificateA4({
  certificateId,
  fullName,
  qualification,
  issueDate,
  seaMiles,
  photoUrl,
  qrCodeDataUrl,
  verificationHash,
  instructorName,
}: GenerateCertificateA4Params) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "certificate-templates",
    "certificate-a4.png"
  );

  const outputDir = path.join(
    process.cwd(),
    "public",
    "generated-certificates"
  );

  await fs.mkdir(outputDir, { recursive: true });

  const outputFileName = `${certificateId}-certificate.png`;
  const outputPath = path.join(outputDir, outputFileName);

  const templateBuffer = await fs.readFile(templatePath);
  const metadata = await sharp(templateBuffer).metadata();

  const width = metadata.width || 1240;
  const height = metadata.height || 1754;

  const overlays: sharp.OverlayOptions[] = [];

  // PHOTO
  const photoBuffer = await loadPhotoBuffer(photoUrl);

  if (photoBuffer) {
    const preparedPhoto = await sharp(photoBuffer)
      .resize(260, 320, {
        fit: "cover",
        position: "centre",
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="260" height="320">
              <rect width="260" height="320" rx="20" ry="20" fill="white"/>
            </svg>
          `),
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    overlays.push({
      input: preparedPhoto,
      left: 860,
      top: 260,
    });
  }

  // QR
  if (qrCodeDataUrl) {
    const qrBuffer = Buffer.from(
      qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    const qrImage = await sharp(qrBuffer)
      .resize(220, 220)
      .png()
      .toBuffer();

    overlays.push({
      input: qrImage,
      left: 900,
      top: 1200,
    });
  }

  // TEXT
  const textOverlay = createA4TextSvg({
    width,
    height,
    fullName,
    qualification,
    certificateId,
    issueDate,
    seaMiles,
    verificationHash,
    instructorName,
  });

  overlays.push({
    input: textOverlay,
    left: 0,
    top: 0,
  });

  await sharp(templateBuffer)
    .composite(overlays)
    .png()
    .toFile(outputPath);

  return `/generated-certificates/${outputFileName}`;
}