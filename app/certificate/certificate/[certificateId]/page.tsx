import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type CertificatePageProps = {
  params: Promise<{
    certificateId: string;
  }>;
};

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR").format(date);
}

export default async function CertificatePublicPage({
  params,
}: CertificatePageProps) {
  const { certificateId } = await params;

  const certificate = await prisma.certificate.findFirst({
    where: {
      certificateId,
    },
    select: {
      id: true,
      fullName: true,
      program: true,
      certificateId: true,
      qualificationLevel: true,
      issueDate: true,
      seaMiles: true,
      photoUrl: true,
      cardFrontUrl: true,
      cardBackUrl: true,
      status: true,
    },
  });

  if (!certificate) {
    notFound();
  }

  const isActive = certificate.status === "ACTIVE";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #12324a 0%, #06111d 55%, #020617 100%)",
        color: "#fff",
        padding: "48px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 28,
          padding: 32,
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
        }}
      >
        <p
          style={{
            letterSpacing: 2,
            fontSize: 12,
            color: "#d6b66d",
            marginBottom: 10,
          }}
        >
          ALBATROS SAILING OFFICIAL CERTIFICATE
        </p>

        <h1 style={{ fontSize: 36, margin: "0 0 12px" }}>
          Certificate Verification
        </h1>

        <div
          style={{
            display: "inline-flex",
            padding: "8px 14px",
            borderRadius: 999,
            background: isActive
              ? "rgba(34,197,94,0.16)"
              : "rgba(239,68,68,0.16)",
            color: isActive ? "#86efac" : "#fca5a5",
            border: isActive
              ? "1px solid rgba(34,197,94,0.45)"
              : "1px solid rgba(239,68,68,0.45)",
            marginBottom: 28,
          }}
        >
          {isActive ? "ACTIVE / GEÇERLİ" : "NOT ACTIVE / AKTİF DEĞİL"}
        </div>

        {!isActive && (
          <div
            style={{
              marginBottom: 28,
              padding: 18,
              borderRadius: 18,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
              color: "#fecaca",
            }}
          >
            Bu sertifika aktif değildir. Doğrulama ekranında geçerli sertifika
            olarak gösterilmez.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          <Info label="Ad Soyad" value={certificate.fullName} />
          <Info label="Sertifika No" value={certificate.certificateId} />
          <Info label="Program" value={certificate.program || "-"} />
          <Info
            label="Yeterlilik"
            value={certificate.qualificationLevel || "-"}
          />
          <Info label="Düzenleme Tarihi" value={formatDate(certificate.issueDate)} />
          <Info
            label="Deniz Mili"
            value={
              typeof certificate.seaMiles === "number"
                ? `${certificate.seaMiles} NM`
                : "-"
            }
          />
        </div>

        {certificate.cardFrontUrl && (
          <div style={{ marginTop: 34 }}>
            <h2 style={{ fontSize: 18, marginBottom: 14 }}>Certificate Card</h2>
            <img
              src={certificate.cardFrontUrl}
              alt="Certificate card front"
              style={{
                width: "100%",
                maxWidth: 520,
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{value}</div>
    </div>
  );
}