import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { uploadCertificateFile } from "@/lib/upload-certificate-file";
type Params = {
  certificateId: string;
  qrCodeDataUrl: string;
};

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function svgText(width: number, height: number) {
  return Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">

    <defs>
      <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ac8b37"/>
        <stop offset="45%" stop-color="#e6d18a"/>
        <stop offset="55%" stop-color="#fff3c4"/>
        <stop offset="100%" stop-color="#a8842a"/>
      </linearGradient>
    </defs>

    <style>
      .header {
        font-size: 52px;
        font-weight: 700;
        fill: #1f2f45;
        font-family: Georgia, "Times New Roman", serif;
        letter-spacing: 2px;
      }

      .subheader {
        font-size: 20px;
        fill: #4a5568;
        font-family: Georgia, "Times New Roman", serif;
        letter-spacing: 2px;
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        fill: #1f2f45;
        font-family: Georgia, "Times New Roman", serif;
      }

      .body {
        font-size: 22px;
        fill: #2f2f2f;
        font-family: Georgia, "Times New Roman", serif;
      }

      .body2 {
        font-size: 21px;
        fill: #3a3a3a;
        font-family: Georgia, "Times New Roman", serif;
      }

      .verifyTitle {
        font-size: 24px;
        font-weight: 700;
        fill: #1f2f45;
        font-family: Georgia, "Times New Roman", serif;
      }

      .verifyText {
        font-size: 20px;
        fill: #444;
        font-family: Georgia, "Times New Roman", serif;
      }

      .instructor {
        font-size: 20px;
        fill: #3f4855;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 600;
      }

      .verifyUrl {
        font-size: 17px;
        fill: #1f2f45;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 700;
      }

      .legalSmall {
        font-size: 14px;
        fill: #6a6a6a;
        font-family: Georgia, "Times New Roman", serif;
      }
    </style>

    <!-- HEADER -->
    <!-- HEADER -->
<text x="240" y="165" class="header">ALBATROS SAILING</text>

<!-- GOLD LINE -->
<line x1="240" y1="195" x2="500" y2="195" stroke="url(#goldLine)" stroke-width="1"/>
<line x1="600" y1="195" x2="860" y2="195" stroke="url(#goldLine)" stroke-width="1"/>
<circle cx="550" cy="195" r="2.2" fill="url(#goldLine)"/>

<!-- SUBHEADER -->
<text x="240" y="235" class="subheader">OFFICIAL CERTIFICATION RECORD</text>

    <!-- MAIN TEXT -->
    <text x="120" y="310" class="body">
      <tspan x="120" dy="0">This identification card certifies that the holder has successfully</tspan>
      <tspan x="120" dy="34">completed the Offshore Yacht Course training program conducted by</tspan>
      <tspan x="120" dy="34">Albatros Sailing School and has demonstrated competency in accordance</tspan>
      <tspan x="120" dy="34">with international sailing training standards.</tspan>
    </text>

    <!-- DECLARATION -->
    <text x="120" y="490" class="title">INTERNATIONAL VALIDITY DECLARATION</text>

    <!-- DECLARATION GOLD LINE -->
<line x1="120" y1="520" x2="380" y2="520" stroke="url(#goldLine)" stroke-width="1"/>
<line x1="480" y1="520" x2="740" y2="520" stroke="url(#goldLine)" stroke-width="1"/>
<circle cx="430" cy="520" r="2.2" fill="url(#goldLine)"/>

    <text x="120" y="555" class="body2">
      <tspan x="120" dy="0">This certification is issued by Albatros Sailing School as a record of</tspan>
      <tspan x="120" dy="32">training completion. It does not constitute a governmental license or</tspan>
      <tspan x="120" dy="32">official authorization to operate a vessel. Recognition of this</tspan>
      <tspan x="120" dy="32">certification is subject to the regulations of local maritime authorities.</tspan>
    </text>

    <!-- EXTRA DISCLAIMER -->
    <text x="120" y="720" class="legalSmall">
      <tspan x="120" dy="0">This document is provided for informational and verification purposes only.</tspan>
      <tspan x="120" dy="24">Albatros Sailing School assumes no legal responsibility for the holder’s</tspan>
      <tspan x="120" dy="24">actions or use of this certification.</tspan>
    </text>

    <!-- VERIFICATION -->
    <text x="820" y="490" class="verifyTitle">Certificate Verification</text>

    <text x="820" y="555" class="verifyText">
      <tspan x="820" dy="0">Scan the QR code or visit</tspan>
      <tspan x="820" dy="30">the link below and enter</tspan>
      <tspan x="820" dy="30">the certificate ID.</tspan>
    </text>

    <!-- SIGNATURE LINE -->
    <line x1="120" y1="825" x2="520" y2="825"
      stroke="rgba(0, 0, 0, 0.55)" stroke-width="1.4" />

    <!-- INSTRUCTOR -->
    <text x="240" y="850" text-anchor="middle" class="instructor">
      Instructor
    </text>

    <!-- VERIFY URL -->
    <text x="140" y="905" class="verifyUrl">
      www.albatros-sailing.com/verify
    </text>

    <!-- LEGAL BOTTOM -->
    <text x="140" y="940" class="legalSmall">
      Not a government-issued license. • Registration record AS-Global
    </text>

  </svg>
  `);
}

export async function generateCertificateCardBack({
  certificateId,
  qrCodeDataUrl,
}: Params) {
  const template = path.join(process.cwd(), "public/templates/card-back.png");
  const signaturePath = path.join(process.cwd(), "public/signature.png");
  const logoPath = path.join(process.cwd(), "public/logo.png");
  const outputDir = path.join(process.cwd(), "public/generated-cards");

  await fs.mkdir(outputDir, { recursive: true });

  const base = await fs.readFile(template);
  const meta = await sharp(base).metadata();

  const width = meta.width || 1536;
  const height = meta.height || 1024;

  const overlays: sharp.OverlayOptions[] = [];
  const safeId = escapeXml(certificateId);

  // LOGO
  try {
    const logo = await sharp(logoPath)
      .resize({ width: 90 })
      .png()
      .toBuffer();

    overlays.push({
      input: logo,
      left: 165,
      top: 70,
    });
  } catch {}

  // QR SETTINGS
  const QR_SIZE = 140;
  const qrLeft = 1190;
  const qrTop = 680;
  const padding = 14;

  const qrBuffer = Buffer.from(
    qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );

  const qr = await sharp(qrBuffer)
    .resize(QR_SIZE, QR_SIZE)
    .png()
    .toBuffer();

  // PREMIUM QR FRAME + EMBOSS + UV / HOLOGRAM
  overlays.push({
    input: Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b38a2c"/>
            <stop offset="25%" stop-color="#f3de96"/>
            <stop offset="50%" stop-color="#c8a448"/>
            <stop offset="75%" stop-color="#fff1b8"/>
            <stop offset="100%" stop-color="#9f7720"/>
          </linearGradient>

          <linearGradient id="uvSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.00)"/>
            <stop offset="25%" stop-color="rgba(173,216,255,0.10)"/>
            <stop offset="50%" stop-color="rgba(255,230,170,0.12)"/>
            <stop offset="75%" stop-color="rgba(180,255,240,0.08)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.00)"/>
          </linearGradient>

          <linearGradient id="innerLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
          </linearGradient>
        </defs>

        <!-- EMBOSS SHADOW -->
        <rect
          x="${qrLeft - padding + 4}"
          y="${qrTop - padding + 6}"
          width="${QR_SIZE + padding * 2}"
          height="${QR_SIZE + padding * 2}"
          rx="14"
          ry="14"
          fill="rgba(20,30,45,0.08)"
        />

        <!-- OUTER GOLD FRAME -->
        <rect
          x="${qrLeft - padding - 3}"
          y="${qrTop - padding - 3}"
          width="${QR_SIZE + padding * 2 + 6}"
          height="${QR_SIZE + padding * 2 + 6}"
          rx="16"
          ry="16"
          fill="none"
          stroke="url(#goldFrame)"
          stroke-width="2.4"
        />

        <!-- INNER FRAME -->
        <rect
          x="${qrLeft - padding}"
          y="${qrTop - padding}"
          width="${QR_SIZE + padding * 2}"
          height="${QR_SIZE + padding * 2}"
          rx="14"
          ry="14"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(120,120,120,0.22)"
          stroke-width="1.2"
        />

        <!-- EMBOSS LIGHT -->
        <rect
          x="${qrLeft - padding + 2}"
          y="${qrTop - padding + 2}"
          width="${QR_SIZE + padding * 2 - 4}"
          height="${QR_SIZE + padding * 2 - 4}"
          rx="12"
          ry="12"
          fill="url(#innerLight)"
        />

        <!-- UV SHEEN -->
        <rect
          x="${qrLeft - padding}"
          y="${qrTop - padding}"
          width="${QR_SIZE + padding * 2}"
          height="${QR_SIZE + padding * 2}"
          rx="14"
          ry="14"
          fill="url(#uvSheen)"
        />

        <!-- MICRO SECURITY LINE -->
        <text
          x="${qrLeft + QR_SIZE / 2}"
          y="${qrTop + QR_SIZE + padding + 10}"
          text-anchor="middle"
          font-size="8"
          fill="rgba(110,110,110,0.40)"
          letter-spacing="1.4"
          font-family="Arial, Helvetica, sans-serif">
          ALBATROS SAILING • OFFICIAL VERIFICATION • AS GLOBAL
        </text>
      </svg>
    `),
  });
// TEXT
  overlays.push({
    input: svgText(width, height),
  });
  // QR IMAGE
  overlays.push({
    input: qr,
    left: qrLeft,
    top: qrTop,
  });

  // BUTTON
  overlays.push({
    input: Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="btnFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#274a75"/>
            <stop offset="100%" stop-color="#1f3557"/>
          </linearGradient>
        </defs>

        <rect
          x="${qrLeft + (QR_SIZE / 2 - 92)}"
          y="${qrTop + QR_SIZE + 18}"
          width="184"
          height="38"
          rx="10"
          ry="10"
          fill="url(#btnFill)"
        />

        <text
          x="${qrLeft + QR_SIZE / 2}"
          y="${qrTop + QR_SIZE + 42}"
          font-size="14"
          text-anchor="middle"
          fill="#fff"
          font-family="Arial, Helvetica, sans-serif"
          font-weight="700">
          Scan to Verify
        </text>
      </svg>
    `),
  });

  // CERTIFICATE ID + FORMAT
  overlays.push({
    input: Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="${qrLeft + QR_SIZE / 2}"
          y="${qrTop + QR_SIZE + 78}"
          font-size="17"
          text-anchor="middle"
          fill="#2a2f38"
          font-family="Arial, Helvetica, sans-serif"
          font-weight="700">
          ${safeId}
        </text>

        <text
          x="${qrLeft + QR_SIZE / 2}"
          y="${qrTop + QR_SIZE + 104}"
          font-size="11"
          text-anchor="middle"
          fill="#6a6a6a"
          font-family="Georgia, 'Times New Roman', serif">
          AS-Official Format • 2026
        </text>
      </svg>
    `),
  });

  // SIGNATURE
  try {
    const signature = await sharp(signaturePath)
      .resize({ width: 220 })
      .png()
      .toBuffer();

    overlays.push({
      input: signature,
      left: 165,
      top: 770,
    });
  } catch (e) {
  console.error(e);
}
  

  const file = `${certificateId}-back.png`;
  const output = path.join(outputDir, file);

  const finalBuffer = await sharp(base)
  .composite(overlays)
  .png()
  .toBuffer();

return await uploadCertificateFile(file, finalBuffer);
}