export async function uploadCertificateFile(fileName: string, buffer: Buffer) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Supabase URL missing");
  }

  if (!serviceKey) {
    throw new Error("Supabase service role key missing");
  }

  const bucket = "certificates";

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `generated-cards/${safeFileName}`;

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "image/png",
      "x-upsert": "true",
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upload failed: ${text}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
}