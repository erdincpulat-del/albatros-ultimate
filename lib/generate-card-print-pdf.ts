import PDFDocument from "pdfkit";
import fs from "fs/promises";
import path from "path";

export async function generateCardPrintPdf(
  certificateId: string,
  frontUrl: string,
  backUrl: string
) {
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

  const pdfPath = path.join(outputDir, `${certificateId}-card-print.pdf`);

  const frontBuffer = await fs.readFile(frontPath);
  const backBuffer = await fs.readFile(backPath);

  const doc = new PDFDocument({
    size: [243, 153],
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

  const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.addPage({
      size: [243, 153],
      margin: 0,
    });

    doc.image(frontBuffer, 0, 0, {
      width: 243,
      height: 153,
    });

    doc.addPage({
      size: [243, 153],
      margin: 0,
    });

    doc.image(backBuffer, 0, 0, {
      width: 243,
      height: 153,
    });

    doc.end();
  });

  await fs.writeFile(pdfPath, pdfBuffer);

  return `/generated-cards/${certificateId}-card-print.pdf`;
}