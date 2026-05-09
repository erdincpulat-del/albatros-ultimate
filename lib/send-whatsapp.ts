import "server-only";

type SendWhatsAppParams = {
  title: string;
  lines: Array<string | null | undefined>;
};

function cleanLine(value: string | null | undefined) {
  if (!value) return "";
  return value.trim();
}

export async function sendWhatsAppNotification({
  title,
  lines,
}: SendWhatsAppParams) {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyTo = process.env.WHATSAPP_NOTIFY_TO;

  if (!token || !phoneNumberId || !notifyTo) {
    throw new Error("WhatsApp env değişkenleri eksik.");
  }

  const body = [
    title,
    "",
    ...lines.map(cleanLine).filter(Boolean),
  ].join("\n");

  const response = await fetch(
    `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: notifyTo,
        type: "text",
        text: {
          body,
        },
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `WhatsApp gönderim hatası: ${JSON.stringify(data)}`
    );
  }

  return data;
}