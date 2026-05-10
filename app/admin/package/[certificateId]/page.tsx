import prisma from "@/lib/prisma";

type PageProps = {
  params: {
    certificateId: string;
  }
};

export default async function CertificatePackagePage({ params }: PageProps) {
  const { certificateId } = await params;

  const certificate = await prisma.certificate.findFirst({
    where: {
      certificateId,
    },
    select: {
      fullName: true,
      certificateId: true,
      qualificationLevel: true,
      program: true,
      seaMiles: true,
      cardFrontUrl: true,
      cardBackUrl: true,
    },
  });

  if (!certificate) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#07131f",
          color: "white",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
            padding: 28,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(103,232,249,0.8)",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Albatros Sailing
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              marginBottom: 10,
            }}
          >
            Certificate Package Not Found
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            The requested certificate package could not be found for ID:
            {" "}
            <strong style={{ color: "white" }}>{certificateId}</strong>
          </p>
        </div>
      </main>
    );
  }

  const data = certificate;

  const verifyUrl = `/verify/${encodeURIComponent(data.certificateId)}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07131f",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(103,232,249,0.8)",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Albatros Sailing
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              marginBottom: 10,
            }}
          >
            Certificate Package
          </h1>

          <div style={{ color: "rgba(255,255,255,0.6)" }}>
            {data.certificateId}
          </div>
        </div>

        <div
          style={{
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
            overflow: "hidden",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                {data.fullName}
              </div>

              <div style={{ marginTop: 6, opacity: 0.6 }}>
                {data.qualificationLevel || "-"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <ActionLink
                href={verifyUrl}
                label="Open Verify"
                border="rgba(103,232,249,0.35)"
                bg="rgba(103,232,249,0.12)"
                color="#67e8f9"
              />

              {data.cardFrontUrl && (
                <ActionLink
                  href={data.cardFrontUrl}
                  label="Open Front"
                  border="rgba(255,255,255,0.16)"
                  bg="rgba(255,255,255,0.05)"
                  color="white"
                />
              )}

              {data.cardBackUrl && (
                <ActionLink
                  href={data.cardBackUrl}
                  label="Open Back"
                  border="rgba(255,255,255,0.16)"
                  bg="rgba(255,255,255,0.05)"
                  color="white"
                />
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <ImageBox
              title="Front Card"
              imageUrl={data.cardFrontUrl}
              emptyText="Front card not available"
            />

            <ImageBox
              title="Back Card"
              imageUrl={data.cardBackUrl}
              emptyText="Back card not available"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
            }}
          >
            <InfoBox title="Program" value={data.program || "-"} />
            <InfoBox
              title="Sea Miles"
              value={
                typeof data.seaMiles === "number"
                  ? `${data.seaMiles} NM`
                  : "-"
              }
            />
            <InfoBox
              title="Level"
              value={data.qualificationLevel || "-"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.48)",
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function ActionLink({
  href,
  label,
  border,
  bg,
  color,
}: {
  href: string;
  label: string;
  border: string;
  bg: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        padding: "10px 14px",
        borderRadius: "999px",
        border: `1px solid ${border}`,
        background: bg,
        color,
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {label}
    </a>
  );
}

function ImageBox({
  title,
  imageUrl,
  emptyText,
}: {
  title: string;
  imageUrl?: string | null;
  emptyText: string;
}) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0a1a29",
        padding: "18px",
      }}
    >
      <p
        style={{
          marginBottom: "14px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(103,232,249,0.8)",
        }}
      >
        {title}
      </p>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            borderRadius: "16px",
            display: "block",
            boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
          }}
        />
      ) : (
        <div
          style={{
            aspectRatio: "1.586 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.25)",
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            padding: "20px",
            fontSize: "14px",
          }}
        >
          {emptyText}
        </div>
      )}
    </div>
  );
}