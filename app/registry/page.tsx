"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getMessages } from "@/messages";

type RegistryCertificate = {
  id: string;
  fullName: string;
  certificateId?: string | null;
  certificateLevel?: string | null;
  program?: string | null;
  seaMiles?: number | null;
  status?: string | null;
  cardFrontUrl?: string | null;
  certifiedAt?: string | null;
};

export default function RegistryPage() {
  const { locale } = useLanguage();
  const t = useMemo(() => getMessages(locale), [locale]);

  const ui = {
    badge:
      locale === "tr"
        ? "ALBATROS SAILING · RESMİ KAYIT SİSTEMİ"
        : "ALBATROS SAILING · OFFICIAL REGISTRY",
    title:
      locale === "tr"
        ? "Global sertifika kayıt sistemi"
        : "Global certificate registry",
    description:
      locale === "tr"
        ? "Sertifika ID girerek Albatros Sailing dijital kayıt sisteminde arama yapın ve resmi belge kaydını görüntüleyin."
        : "Search the Albatros Sailing digital registry by entering a certificate ID and review the official document record.",
    inputLabel: locale === "tr" ? "Sertifika ID" : "Certificate ID",
    inputPlaceholder:
      locale === "tr" ? "Örnek: AS-OFF-2026-1735" : "Example: AS-OFF-2026-1735",
    search: locale === "tr" ? "Sertifika Ara" : "Search Certificate",
    searching: locale === "tr" ? "Aranıyor..." : "Searching...",
    emptyAlert:
      locale === "tr"
        ? "Lütfen sertifika ID girin."
        : "Please enter a certificate ID.",
    searchError:
      locale === "tr"
        ? "Arama sırasında hata oluştu."
        : "An error occurred during search.",
    notFound:
      locale === "tr"
        ? "Bu sertifika ID için kayıt bulunamadı."
        : "No record was found for this certificate ID.",
    resultTitle: locale === "tr" ? "Kayıt Sonucu" : "Registry Result",
    fullName: locale === "tr" ? "Ad Soyad" : "Full Name",
    certificateId: locale === "tr" ? "Sertifika ID" : "Certificate ID",
    qualification: locale === "tr" ? "Yeterlilik" : "Qualification",
    seaMiles: locale === "tr" ? "Deniz Mili" : "Sea Miles",
    status: locale === "tr" ? "Durum" : "Status",
    issueDate: locale === "tr" ? "Tarih" : "Issue Date",
    verifyButton:
      locale === "tr"
        ? "Tam Doğrulama Sayfasını Aç"
        : "Open Full Verify Page",
    trustTitle: locale === "tr" ? "Kayıt Güveni" : "Registry Trust",
    trustText:
      locale === "tr"
        ? "Kayıt sistemi, belgenin yalnızca basılı kart olmadığını; kurumsal yapının içinde yer alan doğrulanabilir resmi kayıt olduğunu gösterir."
        : "The registry system shows that the document is not only a printed card, but a verifiable official record within the institutional structure.",
    infoCards:
      locale === "tr"
        ? [
            {
              title: "Resmi Kayıt",
              text: "Sertifika verisi sistem içinde saklanır ve arama sonucu ile görünür hale gelir.",
            },
            {
              title: "Doğrulanabilir Yapı",
              text: "Kayıt ekranı, belgenin sistem tarafından desteklendiğini ve kontrol edilebilir olduğunu gösterir.",
            },
            {
              title: "Premium Güven",
              text: "Bu akış, eğitim yapısının ciddiyetini ve marka güvenini daha görünür kılar.",
            },
          ]
        : [
            {
              title: "Official Record",
              text: "Certificate data is stored in the system and made visible through the search result.",
            },
            {
              title: "Verifiable Structure",
              text: "The registry screen shows that the document is supported by the system and can be checked.",
            },
            {
              title: "Premium Trust",
              text: "This flow makes the seriousness of the training structure and brand trust more visible.",
            },
          ],
    systemBadge:
      locale === "tr" ? "Kayıt Destekli Sistem" : "Registry-Backed Structure",
    systemText:
      locale === "tr"
        ? "Bu ekran, sertifikanın sistem içinde yaşadığını ve tek başına basılı bir belge olmadığını gösterir."
        : "This screen shows that the certificate lives within the system and is not a standalone printed document.",
  };

  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistryCertificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  const normalizedCertificateId = certificateId.trim().toUpperCase();

  async function handleSearch() {
    if (!normalizedCertificateId) {
      alert(ui.emptyAlert);
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setNotFound(false);

      const res = await fetch(
        `/api/registry?certificateId=${encodeURIComponent(normalizedCertificateId)}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        alert(data?.error || ui.searchError);
        return;
      }

      if (!data.found) {
        setNotFound(true);
        return;
      }

      setResult(data.certificate);
    } catch (error) {
      console.error(error);
      alert(ui.searchError);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenVerify() {
    if (!result?.certificateId) return;
    window.location.href = `/verify/${encodeURIComponent(result.certificateId)}`;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <main
      className="text-white"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(103,211,255,0.08), transparent 32%), linear-gradient(180deg, #020617 0%, #07111d 48%, #020617 100%)",
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background:
            "linear-gradient(180deg, rgba(8,14,24,0.62), rgba(8,14,24,0.42))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(103,211,255,0.10), transparent 35%), radial-gradient(circle at bottom right, rgba(56,189,248,0.08), transparent 30%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "8px 14px",
                  background: "rgba(103,211,255,0.08)",
                  border: "1px solid rgba(103,211,255,0.18)",
                  color: "#8ed8ff",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                }}
              >
                {ui.badge}
              </div>

              <h1
                style={{
                  marginTop: 24,
                  fontSize: "clamp(40px, 5vw, 70px)",
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.04em",
                  color: "#f8fafc",
                }}
              >
                {ui.title}
              </h1>

              <p
                style={{
                  marginTop: 20,
                  maxWidth: "42rem",
                  fontSize: 18,
                  lineHeight: 1.85,
                  color: "rgba(226,232,240,0.82)",
                }}
              >
                {ui.description}
              </p>

              <div
                style={{
                  marginTop: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 18,
                  padding: "14px 16px",
                  background:
                    "linear-gradient(180deg, rgba(14,20,32,0.90), rgba(10,15,24,0.92))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#8CFF7A",
                    boxShadow: "0 0 14px rgba(140,255,122,0.85)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(226,232,240,0.62)",
                    }}
                  >
                    {ui.systemBadge}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#e2e8f0",
                    }}
                  >
                    {ui.systemText}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: "2rem",
                padding: 24,
                background:
                  "linear-gradient(180deg, rgba(14,20,32,0.92), rgba(10,15,24,0.96))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
              }}
            >
              <div
                style={{
                  borderRadius: "1.5rem",
                  padding: 24,
                  background:
                    "linear-gradient(180deg, rgba(12,18,30,0.94), rgba(8,12,20,0.92))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(226,232,240,0.62)",
                  }}
                >
                  {ui.resultTitle}
                </div>

                <div style={{ marginTop: 24 }}>
                  <label
                    htmlFor="registryCertificateId"
                    style={{
                      display: "block",
                      marginBottom: 10,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#e2e8f0",
                    }}
                  >
                    {ui.inputLabel}
                  </label>

                  <input
                    id="registryCertificateId"
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    placeholder={ui.inputPlaceholder}
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      padding: "16px 18px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#f8fafc",
                      fontSize: 15,
                      outline: "none",
                      transition:
                        "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(103,211,255,0.35)";
                      e.currentTarget.style.boxShadow =
                        "0 0 18px rgba(103,211,255,0.18)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.10)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                    }}
                  />
                </div>

                <div style={{ marginTop: 24 }}>
                  <button
                    onClick={handleSearch}
                    style={{
                      display: "inline-flex",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 14,
                      padding: "14px 22px",
                      background: "linear-gradient(180deg, #67d3ff, #42bdf8)",
                      color: "#04121c",
                      fontWeight: 900,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 10px 24px rgba(66,189,248,0.22)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 30px rgba(66,189,248,0.32)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 24px rgba(66,189,248,0.22)";
                    }}
                  >
                    {loading ? ui.searching : ui.search}
                  </button>
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  borderRadius: "1.5rem",
                  padding: "20px 22px",
                  background:
                    "linear-gradient(180deg, rgba(12,18,30,0.94), rgba(8,12,20,0.92))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(226,232,240,0.62)",
                  }}
                >
                  {ui.trustTitle}
                </div>

                <p
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    lineHeight: 1.85,
                    color: "rgba(226,232,240,0.78)",
                  }}
                >
                  {ui.trustText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {notFound && (
          <div
            style={{
              borderRadius: "1.5rem",
              border: "1px solid rgba(248,113,113,0.24)",
              background: "rgba(127,29,29,0.16)",
              padding: 20,
              fontSize: 14,
              fontWeight: 600,
              color: "#fecaca",
            }}
          >
            {ui.notFound}
          </div>
        )}

        {result && (
  <div
    style={{
      borderRadius: "2rem",
      padding: 24,
      background:
        "linear-gradient(180deg, rgba(14,20,32,0.92), rgba(10,15,24,0.96))",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 18px 36px rgba(0,0,0,0.18)",
    }}
    className="md:p-8"
  >
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(226,232,240,0.62)",
            }}
          >
            {ui.resultTitle}
          </div>

          <h2
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            {locale === "tr" ? "Kayıt Bulundu" : "Record Found"}
          </h2>

          <p
            style={{
              marginTop: 12,
              maxWidth: 680,
              fontSize: 14,
              lineHeight: 1.85,
              color: "rgba(226,232,240,0.78)",
            }}
          >
            {locale === "tr"
              ? "Bu sertifika ID, Albatros Sailing kayıt sisteminde eşleşti. Kişisel bilgiler ve kart görselleri yalnızca tam doğrulama sayfasında görüntülenir."
              : "This certificate ID matched the Albatros Sailing registry. Personal details and card visuals are displayed only on the full verification page."}
          </p>
        </div>

        {result.status ? (
          <div
            style={{
              borderRadius: 999,
              padding: "10px 16px",
              background:
                String(result.status).toUpperCase() === "ACTIVE"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(255,255,255,0.05)",
              border:
                String(result.status).toUpperCase() === "ACTIVE"
                  ? "1px solid rgba(34,197,94,0.26)"
                  : "1px solid rgba(255,255,255,0.10)",
              color:
                String(result.status).toUpperCase() === "ACTIVE"
                  ? "#bbf7d0"
                  : "#e2e8f0",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {result.status}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          label={ui.certificateId}
          value={result.certificateId || "-"}
        />
        <InfoCard label={ui.status} value={result.status || "-"} />
      </div>

      <div
        style={{
          borderRadius: "1.5rem",
          padding: 20,
          background:
            "linear-gradient(180deg, rgba(12,18,30,0.94), rgba(8,12,20,0.92))",
          border: "1px solid rgba(103,211,255,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(103,211,255,0.82)",
          }}
        >
          {locale === "tr" ? "Gizlilik Katmanı Aktif" : "Privacy Layer Active"}
        </div>

        <p
          style={{
            marginTop: 12,
            fontSize: 14,
            lineHeight: 1.85,
            color: "rgba(226,232,240,0.78)",
          }}
        >
          {locale === "tr"
            ? "Bu ekran açık öğrenci listesi değildir. Sertifika sahibine ait detaylar, kart ön/arka yüzleri ve PDF indirme işlemleri yalnızca doğrulama ekranında sunulur."
            : "This screen is not a public student list. Holder details, card front/back visuals and PDF downloads are only provided on the verification screen."}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleOpenVerify}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            padding: "14px 22px",
            background: "linear-gradient(180deg, #67d3ff, #42bdf8)",
            color: "#04121c",
            fontWeight: 900,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 24px rgba(66,189,248,0.22)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 16px 30px rgba(66,189,248,0.32)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 10px 24px rgba(66,189,248,0.22)";
          }}
        >
          {ui.verifyButton}
        </button>
      </div>
    </div>
  </div>
)}
      </section>

      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background:
            "linear-gradient(180deg, rgba(8,14,24,0.34), rgba(8,14,24,0.24))",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
          {ui.infoCards.map((item) => (
            <div
              key={item.title}
              style={{
                borderRadius: "1.5rem",
                padding: 24,
                background:
                  "linear-gradient(180deg, rgba(14,20,32,0.90), rgba(10,15,24,0.92))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 18px 36px rgba(0,0,0,0.18)",
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(66,189,248,0.12)";
                e.currentTarget.style.borderColor = "rgba(103,211,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 18px 36px rgba(0,0,0,0.18)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#f8fafc",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  lineHeight: 1.85,
                  color: "rgba(226,232,240,0.78)",
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: "1.25rem",
        padding: 20,
        background:
          "linear-gradient(180deg, rgba(12,18,30,0.94), rgba(8,12,20,0.92))",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(226,232,240,0.62)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 12,
          wordBreak: "break-word",
          fontSize: 16,
          fontWeight: 700,
          color: "#f8fafc",
        }}
      >
        {value}
      </div>
    </div>
  );
}