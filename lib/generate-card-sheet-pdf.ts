import PDFDocument from "pdfkit";
import fs from "fs/promises";
import path from "path";

type GenerateCardSheetPdfParams = {
  certificateId: string;
  frontUrl: string;
  backUrl: string;
};

export async function generateCardSheetPdf({
  certificateId,
  frontUrl,
  backUrl,
}: GenerateCardSheetPdfParams) {
  const outputDir = path.join(process.cwd(), "public", "generated-cards");

  const frontPath = path.join(
    process.cwd(),
    "public",
    frontUrl.replace(/^\//, "")
  );

  const backPath = path.join(
    process.cwd(),
    "public",
    backUrl.replace(/^\//, "")
  );

  await fs.mkdir(outputDir, { recursive: true });

  const pdfPath = path.join(outputDir, `${certificateId}-card-sheet.pdf`);

  const frontBuffer = await fs.readFile(frontPath);
  const backBuffer = await fs.readFile(backPath);

  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
    autoFirstPage: false,
  });

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Roboto-Regular.ttf"
  );

  doc.font(fontPath);

  const chunks: Buffer[] = [];

  const pageWidth = 595.28;
  const pageHeight = 841.89;

  const cardWidth = 243;
  const cardHeight = 153;

  const cols = 2;
  const rows = 3;

  const horizontalGap = 20;
  const verticalGap = 20;

  const totalGridWidth = cols * cardWidth + (cols - 1) * horizontalGap;
  const totalGridHeight = rows * cardHeight + (rows - 1) * verticalGap;

  const startX = (pageWidth - totalGridWidth) / 2;
  const startY = (pageHeight - totalGridHeight) / 2;

  const drawGridPage = (imageBuffer: Buffer) => {
    doc.addPage({
      size: "A4",
      margin: 0,
    });

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = startX + col * (cardWidth + horizontalGap);
        const y = startY + row * (cardHeight + verticalGap);

        doc.image(imageBuffer, x, y, {
          width: cardWidth,
          height: cardHeight,
        });
      }
    }
  };

  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawGridPage(frontBuffer);
    drawGridPage(backBuffer);

    doc.end();
  });

  await fs.writeFile(pdfPath, pdfBuffer);

  return `/generated-cards/${certificateId}-card-sheet.pdf`;
}