import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryEmail(data: any) {
  try {
    await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM!,
      to: [process.env.NOTIFY_EMAIL_TO!],
      subject: `🔥 Yeni Talep - ${data.fullName}`,
      text: `
Yeni Talep Geldi

İsim: ${data.fullName}
Telefon: ${data.phone || "-"}
Email: ${data.email || "-"}
Tip: ${data.type}
Lead Score: ${data.leadScore}
Değer: €${data.estimatedValue}

Program: ${data.trainingProgram || "-"}
Rota: ${data.routePreference || "-"}
`,
    });
  } catch (err) {
    console.error("MAIL ERROR:", err);
  }
}