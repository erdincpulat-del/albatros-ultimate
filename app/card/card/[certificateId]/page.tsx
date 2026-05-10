import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type PageProps = {
  params: {
    certificateId: string;
  };
};

function normalizeStatus(status?: string | null) {
  const value = String(status || "PENDING").toUpperCase();

  if (value === "ACTIVE") return "ACTIVE";
  if (value === "REVOKED") return "REVOKED";
  if (value === "EXPIRED") return "EXPIRED";
  return "PENDING";
}

function statusConfig(status: string) {
  if (status === "ACTIVE") {
    return {
      label: "ACTIVE",
      text: "#86efac",
      border: "rgba(34,197,94,0.28)",
      background: "rgba(34,197,94,0.10)",
      dot: "#22c55e",
      glow: "0 0 32px rgba(34,197,94,0.20)",
    };
  }

  if (status === "REVOKED") {
    return {
      label: "REVOKED",
      text: "#fca5a5",
      border: "rgba(239,68,68,0.28)",
      background: "rgba(239,68,68,0.10)",
      dot: "#ef4444",
      glow: "0 0 32px rgba(239,68,68,0.18)",
    };
  }

  if (status === "EXPIRED") {
    return {
      label: "EXPIRED",
      text: "#fde68a",
      border: "rgba(245,158,11,0.28)",
      background: "rgba(245,158,11,0.10)",
      dot: "#f59e0b",
      glow: "0 0 32px rgba(245,158,11,0.16)",
    };
  }

  return {
    label: "PENDING",
    text: "#cbd5e1",
    border: "rgba(148,163,184,0.24)",
    background: "rgba(148,163,184,0.10)",
    dot: "#94a3b8",
    glow: "0 0 32px rgba(148,163,184,0.14)",
  };
}

export default async function CardPage({ params }: PageProps) {
  const { certificateId } = params;
  const cleanId = decodeURIComponent(String(certificateId || "")).trim();

  if (!cleanId) {
    notFound();
  }

  const certificate = await prisma.certificate.findUnique({
    where: {
      certificateId: cleanId,
    },
    select: {
      id: true,
      fullName: true,
      certificateId: true,
      program: true,
      qualificationLevel: true,
      issueDate: true,
      status: true,
      cardFrontUrl: true,
    },
  });

  if (!certificate || !certificate.cardFrontUrl) {
    notFound();
  }

  const status = normalizeStatus(certificate.status);
  const badge = statusConfig(status);

  return (
    <main style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />
      <div style={styles.gridOverlay} />
      <div style={styles.noiseOverlay} />

      <section style={styles.container}>
        <div style={styles.badge}>ALBATROS SAILING • DIGITAL CARD VIEW</div>

        <h1 style={styles.title}>Kart Görüntüleme</h1>

        <p style={styles.description}>
          Bu alanda yalnızca seçilen sertifika kartının ön yüzü görüntülenir.
        </p>

        <div style={styles.topRow}>
          <div
            style={{
              ...styles.statusBadge,
              color: badge.text,
              borderColor: badge.border,
              background: badge.background,
              boxShadow: badge.glow,
            }}
          >
            <span
              style={{
                ...styles.statusDot,
                background: badge.dot,
                boxShadow: `0 0 14px ${badge.dot}`,
              }}
            />
            {badge.label}
          </div>

          <div style={styles.codePill}>{certificate.certificateId}</div>
        </div>

        <div style={styles.cardShell} className="card-shell-hover">
          <div style={styles.cardGlow} />

          <div style={styles.cardPreviewWrap}>
            <Image
              src={certificate.cardFrontUrl}
              alt={`${certificate.fullName || "Certificate"} card front`}
              width={1200}
              height={760}
              style={styles.cardPreview}
              priority
              className="card-front-image"
            />
          </div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Ad Soyad</div>
            <div style={styles.infoValue}>{certificate.fullName || "-"}</div>
          </div>

          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Seviye</div>
            <div style={styles.infoValue}>
              {certificate.qualificationLevel || "-"}
            </div>
          </div>

          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Program</div>
            <div style={styles.infoValue}>{certificate.program || "-"}</div>
          </div>

          <div style={styles.infoBox}>
            <div style={styles.infoLabel}>Kart Kodu</div>
            <div style={styles.infoValue}>
              {certificate.certificateId || "-"}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <Link
            href={`/verify/${encodeURIComponent(certificate.certificateId)}`}
            style={styles.primaryAction}
          >
            Doğrulama Ekranını Aç
          </Link>

          <Link href="/verify" style={styles.secondaryAction}>
            Yeni Kod Gir
          </Link>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .card-shell-hover {
              transition:
                transform 220ms ease,
                box-shadow 220ms ease,
                border-color 220ms ease;
            }

            .card-front-image {
              transition: transform 240ms ease, filter 240ms ease;
            }

            .card-shell-hover:hover {
              transform: translateY(-6px);
              box-shadow:
                0 28px 58px rgba(0,0,0,0.34),
                0 0 0 1px rgba(103,211,255,0.08);
              border-color: rgba(103,211,255,0.16);
            }

            .card-shell-hover:hover .card-front-image {
              transform: scale(1.012);
              filter: saturate(1.03);
            }

            @media (max-width: 900px) {
              .card-shell-hover {
                border-radius: 20px !important;
              }
            }

            @media (max-width: 820px) {
              .card-info-grid {
                grid-template-columns: 1fr 1fr !important;
              }
            }

            @media (max-width: 560px) {
              .card-info-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 24%), linear-gradient(180deg, #07101d 0%, #0a1426 42%, #08111c 100%)",
    color: "#f8fafc",
    overflow: "hidden",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  glowA: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "rgba(56,189,248,0.10)",
    filter: "blur(84px)",
    top: -140,
    left: -140,
    pointerEvents: "none",
  },

  glowB: {
    position: "absolute",
    width: 440,
    height: 440,
    borderRadius: "50%",
    background: "rgba(59,130,246,0.08)",
    filter: "blur(96px)",
    right: -120,
    top: 160,
    pointerEvents: "none",
  },

  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.18,
    pointerEvents: "none",
  },

  noiseOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02), transparent 30%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.02), transparent 24%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.015), transparent 28%)",
    pointerEvents: "none",
  },

  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1180,
    margin: "0 auto",
    padding: "124px 24px 72px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(103,211,255,0.10)",
    border: "1px solid rgba(103,211,255,0.18)",
    color: "#8ed8ff",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 18,
    boxShadow: "0 0 24px rgba(103,211,255,0.08)",
    backdropFilter: "blur(10px)",
  },

  title: {
    margin: 0,
    fontSize: "clamp(36px, 5vw, 64px)",
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    color: "#f8fafc",
  },

  description: {
    marginTop: 16,
    maxWidth: 760,
    fontSize: 17,
    lineHeight: 1.9,
    color: "rgba(226,232,240,0.82)",
  },

  topRow: {
    marginTop: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid transparent",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    backdropFilter: "blur(8px)",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },

  codePill: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  cardShell: {
    position: "relative",
    marginTop: 24,
    borderRadius: 28,
    background:
      "linear-gradient(180deg, rgba(14,20,32,0.84), rgba(10,15,24,0.94))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.24)",
    overflow: "hidden",
    backdropFilter: "blur(14px)",
    padding: 20,
  },

  cardGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top right, rgba(103,211,255,0.08), transparent 28%)",
    pointerEvents: "none",
  },

  cardPreviewWrap: {
    position: "relative",
    zIndex: 2,
    overflow: "hidden",
    borderRadius: 20,
  },

  cardPreview: {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 20px 46px rgba(0,0,0,0.28)",
  },

  infoGrid: {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },

  infoBox: {
    padding: "16px 16px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(226,232,240,0.56)",
  },

  infoValue: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 700,
    color: "#f8fafc",
    lineHeight: 1.6,
  },

  actions: {
    marginTop: 26,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  primaryAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 20px",
    borderRadius: 999,
    background: "linear-gradient(180deg,#67d3ff,#42bdf8)",
    color: "#04121c",
    textDecoration: "none",
    fontWeight: 900,
    boxShadow: "0 10px 24px rgba(66,189,248,0.22)",
  },

  secondaryAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 20px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    textDecoration: "none",
    fontWeight: 800,
  },
};