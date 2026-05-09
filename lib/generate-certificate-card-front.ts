import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import QRCode from "qrcode";
import { uploadCertificateFile } from "@/lib/upload-certificate-file";

type GenerateCertificateCardFrontParams = {
  certificateId: string;
  fullName: string;
  qualification: string;
  issueDate?: string | Date | null;
  seaMiles?: number | null;
  photoUrl?: string | null;
  qrCodeDataUrl?: string | null;
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

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  );
}

async function createQrCodeDataUrl(certificateId: string) {
  const baseUrl = getBaseUrl();
  const verifyUrl = `${baseUrl}/verify?certificateId=${encodeURIComponent(
    certificateId
  )}`;

  return QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 512,
  });
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

async function loadAssetBuffer(relativePath: string) {
  const absolutePath = path.join(process.cwd(), "public", relativePath);
  return fs.readFile(absolutePath);
}

function createFrontTextSvg({
  width,
  height,
  fullName,
  qualification,
  certificateId,
  issueDate,
  seaMiles,
}: {
  width: number;
  height: number;
  fullName: string;
  qualification: string;
  certificateId: string;
  issueDate?: Date | string | null;
  seaMiles?: number | null;
}) {
  const safeFullName = escapeXml(fullName || "");
  const safeQualification = escapeXml(qualification || "");
  const safeCertificateId = escapeXml(certificateId || "");
  const safeIssueDate = escapeXml(formatIssueDate(issueDate));
  const safeSeaMiles = typeof seaMiles === "number" ? `${seaMiles} NM` : "-";

  const fullNameFontSize =
    safeFullName.length > 28 ? 20 : safeFullName.length > 22 ? 22 : 24;

  const qualificationFontSize =
    safeQualification.length > 30
      ? 20
      : safeQualification.length > 24
        ? 22
        : 24;

  return Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9f7600"/>
      <stop offset="18%" stop-color="#d4af37"/>
      <stop offset="42%" stop-color="#ffe27a"/>
      <stop offset="58%" stop-color="#fff2b8"/>
      <stop offset="82%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#8c6700"/>
    </linearGradient>

    <linearGradient id="goldSoft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(184,134,11,0.00)"/>
      <stop offset="20%" stop-color="rgba(212,175,55,0.42)"/>
      <stop offset="50%" stop-color="rgba(246,226,122,0.86)"/>
      <stop offset="80%" stop-color="rgba(212,175,55,0.42)"/>
      <stop offset="100%" stop-color="rgba(184,134,11,0.00)"/>
    </linearGradient>

    <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.00)"/>
      <stop offset="48%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="52%" stop-color="rgba(255,255,255,0.82)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.00)"/>
    </linearGradient>

    <linearGradient id="seaLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(17,56,101,0.00)"/>
      <stop offset="50%" stop-color="rgba(17,56,101,0.28)"/>
      <stop offset="100%" stop-color="rgba(17,56,101,0.00)"/>
    </linearGradient>

    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(246,226,122,0.55)"/>
      <stop offset="40%" stop-color="rgba(212,175,55,0.20)"/>
      <stop offset="100%" stop-color="rgba(212,175,55,0.00)"/>
    </radialGradient>

    <linearGradient id="holoLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.00)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="70%" stop-color="rgba(173,216,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.00)"/>
    </linearGradient>

    <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.18)"/>
    </filter>
  </defs>

  <style>
    .label {
      fill: #23364a;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 0.6px;
      font-family: Georgia, "Times New Roman", serif;
    }
    .value {
      fill: #0f1f2f;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.35px;
      font-family: Georgia, "Times New Roman", serif;
    }
    .small {
      fill: rgba(15,31,47,0.88);
      font-size: 22px;
      font-family: Georgia, "Times New Roman", serif;
    }
    .meta {
      fill: rgba(15,31,47,0.58);
      font-size: 16px;
      font-family: Georgia, "Times New Roman", serif;
      letter-spacing: 0.4px;
    }
    .school {
      fill: #10253b;
      font-size: 24px;
      font-weight: 700;
      font-family: Georgia, "Times New Roman", serif;
    }
    .location {
      fill: rgba(16,37,59,0.92);
      font-size: 22px;
      font-family: Georgia, "Times New Roman", serif;
    }
  </style>

  <g opacity="0.12">
    <line x1="505" y1="230" x2="1135" y2="230" stroke="#60748a" stroke-width="1"/>
    <line x1="505" y1="320" x2="1135" y2="320" stroke="#60748a" stroke-width="1"/>
    <line x1="505" y1="410" x2="1135" y2="410" stroke="#60748a" stroke-width="1"/>
    <line x1="505" y1="500" x2="1135" y2="500" stroke="#60748a" stroke-width="1"/>
    <line x1="505" y1="590" x2="1135" y2="590" stroke="#60748a" stroke-width="1"/>
    <line x1="620" y1="205" x2="620" y2="625" stroke="#60748a" stroke-width="1"/>
    <line x1="760" y1="205" x2="760" y2="625" stroke="#60748a" stroke-width="1"/>
    <line x1="900" y1="205" x2="900" y2="625" stroke="#60748a" stroke-width="1"/>
    <line x1="1040" y1="205" x2="1040" y2="625" stroke="#60748a" stroke-width="1"/>
  </g>

  <text x="262" y="152" font-size="58" font-weight="700" fill="rgba(0,0,0,0.12)" font-family='Georgia, "Times New Roman", serif'>
    Offshore Yacht Course
  </text>

  <text x="260" y="150" font-size="58" font-weight="700" fill="#10253b" font-family='Georgia, "Times New Roman", serif' letter-spacing="1.1" filter="url(#titleShadow)">
    Offshore Yacht Course
  </text>

  <line x1="260" y1="178" x2="790" y2="178" stroke="url(#goldLine)" stroke-width="5.8" stroke-linecap="round"/>
  <rect x="260" y="174" width="530" height="8" fill="url(#goldShimmer)" opacity="0.68"/>

  <path d="M260 196 C360 180, 500 180, 610 196 S835 212, 945 196" fill="none" stroke="url(#goldSoft)" stroke-width="4.4" stroke-linecap="round" opacity="0.92"/>

  <text x="1185" y="160" font-size="19" font-weight="700" letter-spacing="0.4" fill="#10253b" font-family='Georgia, "Times New Roman", serif'>
    ID: ${safeCertificateId}
  </text>

  <rect x="1160" y="185" width="230" height="230" rx="26" fill="rgba(255,255,255,0.30)" stroke="#10253b" stroke-width="2.4"/>
  <rect x="1170" y="195" width="210" height="210" rx="22" fill="none" stroke="url(#goldLine)" stroke-width="2.2"/>
  <rect x="1186" y="206" width="178" height="178" rx="14" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>

  <text x="520" y="285" class="label">Full Name:</text>
  <line x1="520" y1="300" x2="1110" y2="300" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
  <text x="520" y="323" style="fill:#0f1f2f;font-size:${fullNameFontSize}px;font-weight:500;letter-spacing:0.35px;font-family:Georgia, 'Times New Roman', serif;">${safeFullName}</text>

  <text x="520" y="350" class="label">Qualification Level:</text>
  <line x1="520" y1="365" x2="1110" y2="365" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
  <text x="520" y="388" style="fill:#0f1f2f;font-size:${qualificationFontSize}px;font-weight:500;letter-spacing:0.30px;font-family:Georgia, 'Times New Roman', serif;">${safeQualification}</text>

  <text x="520" y="415" class="label">Certificate ID:</text>
  <line x1="520" y1="430" x2="1110" y2="430" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
  <text x="520" y="453" class="value">${safeCertificateId}</text>

  <text x="520" y="480" class="label">Issue Date:</text>
  <line x1="520" y1="495" x2="1110" y2="495" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
  <text x="520" y="518" class="value">${safeIssueDate}</text>

  <text x="520" y="545" class="label">Sea Miles:</text>
  <line x1="520" y1="560" x2="1110" y2="560" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
  <text x="520" y="583" class="value">${safeSeaMiles}</text>

  <line x1="175" y1="742" x2="900" y2="742" stroke="url(#goldLine)" stroke-width="3.8" stroke-linecap="round"/>
  <rect x="175" y="738" width="725" height="6" fill="url(#goldShimmer)" opacity="0.55"/>

  <text x="175" y="774" class="small">This certifies that the holder has successfully completed</text>
  <text x="175" y="804" class="small">the Offshore Yacht Course conducted by</text>

  <line x1="175" y1="822" x2="900" y2="822" stroke="url(#goldLine)" stroke-width="3.8" stroke-linecap="round"/>
  <rect x="175" y="818" width="725" height="6" fill="url(#goldShimmer)" opacity="0.55"/>

  <text x="175" y="860" class="school">Albatros Sailing School</text>
  <line x1="175" y1="872" x2="520" y2="872" stroke="url(#goldLine)" stroke-width="2.8" stroke-linecap="round"/>
  <rect x="175" y="869" width="345" height="5" fill="url(#goldShimmer)" opacity="0.5"/>

  <text x="175" y="900" class="location">Location: Muğla Bodrum, Turkey</text>

  <text x="1008" y="542" class="meta">Official Albatros Sailing Record</text>
  <text x="1018" y="566" class="meta">Maritime Training Certification</text>

  <circle cx="1220" cy="720" r="145" fill="url(#goldGlow)" opacity="0.98"/>

  <path d="M950 845 Q1060 806 1170 845 T1395 845" fill="none" stroke="url(#seaLine)" stroke-width="4.2" stroke-linecap="round"/>
  <path d="M985 878 Q1095 838 1205 878 T1378 878" fill="none" stroke="url(#seaLine)" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M1025 905 Q1115 875 1205 905 T1355 905" fill="none" stroke="url(#seaLine)" stroke-width="1.8" stroke-linecap="round"/>

  <g opacity="0.60" transform="translate(1246 722) rotate(-18 61 61)">
    <rect x="0" y="0" width="122" height="122" rx="61" fill="none"/>
    <rect x="22" y="-10" width="18" height="142" fill="url(#holoLight)"/>
    <rect x="54" y="-10" width="10" height="142" fill="rgba(255,255,255,0.28)"/>
  </g>
</svg>
`);
}

export async function generateCertificateCardFront({
  fullName,
  qualification,
  certificateId,
  issueDate,
  seaMiles,
  photoUrl,
  qrCodeDataUrl,
}: GenerateCertificateCardFrontParams) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "certificate-templates",
    "card-front.png"
  );

  const templateBuffer = await fs.readFile(templatePath);
  const metadata = await sharp(templateBuffer).metadata();

  const width = metadata.width || 1536;
  const height = metadata.height || 1024;

  const overlays: sharp.OverlayOptions[] = [];

  const photoBuffer = await loadPhotoBuffer(photoUrl);

  if (photoBuffer) {
    const preparedPhoto = await sharp(photoBuffer)
      .resize(240, 290, {
        fit: "cover",
        position: "centre",
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="240" height="290" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="240" height="290" rx="18" ry="18" fill="white"/>
            </svg>
          `),
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    overlays.push({
      input: preparedPhoto,
      left: 158,
      top: 238,
    });
  }

  overlays.push({
    input: Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="152" y="232" width="252" height="302" rx="18" ry="18" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2"/>
        <rect x="158" y="238" width="240" height="290" rx="18" ry="18" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      </svg>
    `),
    left: 0,
    top: 0,
  });

  const finalQrCodeDataUrl =
    qrCodeDataUrl || (await createQrCodeDataUrl(certificateId));

  const qrBuffer = Buffer.from(
    finalQrCodeDataUrl.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );

  const qrImage = await sharp(qrBuffer)
    .resize(178, 178, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  overlays.push({
    input: qrImage,
    left: 1188,
    top: 208,
  });

  try {
    const logoBuffer = await loadAssetBuffer("assets/logo-badge.png");

    const embossedShadow = await sharp(logoBuffer)
      .resize(332, 332, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .tint({ r: 30, g: 40, b: 60 })
      .modulate({ brightness: 0.65 })
      .blur(1.6)
      .png()
      .toBuffer();

    overlays.push({
      input: embossedShadow,
      left: 1023,
      top: 556,
      blend: "multiply",
    });

    const embossedHighlight = await sharp(logoBuffer)
      .resize(332, 332, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .modulate({ brightness: 1.22, saturation: 0.92 })
      .png()
      .toBuffer();

    overlays.push({
      input: embossedHighlight,
      left: 1021,
      top: 546,
      blend: "screen",
    });

    const logoImage = await sharp(logoBuffer)
      .resize(332, 332, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .sharpen()
      .png()
      .toBuffer();

    overlays.push({
      input: logoImage,
      left: 1015,
      top: 548,
    });
  } catch (error) {
    console.error("logo load error:", error);
  }

  try {
    const hologramBuffer = await loadAssetBuffer("assets/hologram-badge.png");

    const hologramImage = await sharp(hologramBuffer)
      .resize(122, 122, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .modulate({ brightness: 1.15, saturation: 1.2 })
      .blur(0.3)
      .png()
      .toBuffer();

    overlays.push({
      input: hologramImage,
      left: 1248,
      top: 726,
    });
  } catch (error) {
    console.error("hologram load error:", error);
  }

  overlays.push({
    input: createFrontTextSvg({
      width,
      height,
      fullName,
      qualification,
      certificateId,
      issueDate,
      seaMiles,
    }),
    left: 0,
    top: 0,
  });

  const finalBuffer = await sharp(templateBuffer)
    .composite(overlays)
    .png()
    .toBuffer();

  const outputFileName = `${certificateId}-front.png`;

  return uploadCertificateFile(outputFileName, finalBuffer);
}