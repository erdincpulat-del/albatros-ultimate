import sharp from "sharp";

export async function processStudentPhoto(photoBuffer: Buffer) {

  const processed = await sharp(photoBuffer)
    .resize(400, 500, {
      fit: "cover",
      position: "center"
    })
    .jpeg({ quality: 90 })
    .toBuffer();

  return processed;
}