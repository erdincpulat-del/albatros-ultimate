"use client";
import { createCertificateAction } from "./actions";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type CertificateItem = {
  id: string;
  fullName: string;
  certificateId: string;
  program: string | null;
  qualificationLevel: string | null;
  issueDate: string | null;
  seaMiles: number | null;
  status: string | null;
  photoUrl?: string | null;
  cardFrontUrl?: string | null;
  cardBackUrl?: string | null;
  qrCodeUrl?: string | null;
  verificationHash?: string | null;
  instructor?: {
    id: string;
    fullName: string;
    title: string | null;
  } | null;
};

type AdminLogItem = {
  id: string;
  createdAt: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  details?: string | null;
};

type InstructorItem = {
  id: string;
  fullName: string;
  title: string | null;
};

const programOptions = ["Offshore Yacht Course", "YELKENLI YAT EGITIMI (YES)"];

const OFFSHORE_LEVELS = [
  "INTERNATIONAL BAREBOAT SKIPPER",
  "OFFSHORE SKIPPER",
  "YACHTMASTER",
  "COMPETENT CREW",
];

const YES_LEVELS = ["YY1", "YY2", "YY3", "YY4", "YY5", "YY6"];

const YES_LABELS: Record<string, string> = {
  YY1: "Beginner Crew",
  YY2: "Basic Crew",
  YY3: "Intermediate Sailor",
  YY4: "Advanced Sailor",
  YY5: "Skipper Level",
  YY6: "Master Skipper",
};

function normalizeText(value?: string | null) {
  return (value || "").toLocaleLowerCase("tr-TR");
}

function getStatusLabel(status?: string | null) {
  const normalized = (status || "").toUpperCase();

  if (!normalized) return "UNKNOWN";
  if (normalized === "VERIFIED") return "ACTIVE";
  if (normalized === "CANCELLED") return "REVOKED";

  return normalized;
}

function getStatusMeta(status?: string | null) {
  const normalized = getStatusLabel(status);

  if (normalized === "ACTIVE") {
    return {
      label: "ACTIVE",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.14)",
      border: "rgba(34,197,94,0.32)",
    };
  }

  if (normalized === "PENDING") {
    return {
      label: "PENDING",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.14)",
      border: "rgba(245,158,11,0.32)",
    };
  }

  if (normalized === "REVOKED") {
    return {
      label: "REVOKED",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.14)",
      border: "rgba(239,68,68,0.32)",
    };
  }

  return {
    label: "UNKNOWN",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.24)",
  };
}

function getSecurityMeta(item: CertificateItem) {
  if (!item.verificationHash) {
    return {
      label: "NO HASH",
      color: "#94a3b8",
      bg: "rgba(148,163,184,0.12)",
      border: "rgba(148,163,184,0.24)",
    };
  }

  return {
    label: "HASH STORED",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.14)",
    border: "rgba(34,197,94,0.32)",
  };
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getHashPreview(hash?: string | null) {
  if (!hash) return "-";
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function getVerifyPath(certificateId: string) {
  return `/verify?certificateId=${encodeURIComponent(certificateId)}`;
}

function getFrontCardApiPath(certificateId: string) {
  return `/api/card/front?certificateId=${encodeURIComponent(certificateId)}`;
}

function getBackCardApiPath(certificateId: string) {
  return `/api/card/back?certificateId=${encodeURIComponent(certificateId)}`;
}

async function apiFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();

    if (res.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    throw new Error(text || "API JSON response expected");
  }

  const data = await res.json();

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok || !data.success) {
    throw new Error(data.error || "API error");
  }

  return data as T;
}

export default function AdminPage() {
  const [fullName, setFullName] = useState("");
  const [program, setProgram] = useState("Offshore Yacht Course");
  const [qualificationLevel, setQualificationLevel] = useState(
    "INTERNATIONAL BAREBOAT SKIPPER"
  );
  const [issueDate, setIssueDate] = useState("");
  const [seaMiles, setSeaMiles] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [generatingCardId, setGeneratingCardId] = useState<string | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(
    null
  );

  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<CertificateItem[]>([]);
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const qualificationOptions =
    program === "YELKENLI YAT EGITIMI (YES)" ? YES_LEVELS : OFFSHORE_LEVELS;

  useEffect(() => {
    if (!qualificationOptions.includes(qualificationLevel)) {
      setQualificationLevel(qualificationOptions[0]);
    }
  }, [program, qualificationLevel, qualificationOptions]);

  async function loadCertificates() {
    try {
      setLoadingList(true);

      const data = await apiFetch<{ success: true; items: CertificateItem[] }>(
        "/api/certificates"
      );

      setItems(data.items || []);
    } catch (error) {
      console.error("Load certificates error:", error);
      setItems([]);
    } finally {
      setLoadingList(false);
    }
  }

  async function loadLogs() {
    try {
      setLoadingLogs(true);

      const data = await apiFetch<{ success: true; items: AdminLogItem[] }>(
        "/api/admin-logs"
      );

      setLogs((data.items || []).slice(0, 10));
    } catch (error) {
      console.error("Load logs error:", error);
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  }

  async function loadInstructors() {
    try {
      setLoadingInstructors(true);

      const res = await fetch("/api/instructors", {
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setInstructors(data.items || []);
    } catch (error) {
      console.error("Instructor load error:", error);
      setInstructors([]);
    } finally {
      setLoadingInstructors(false);
    }
  }

  useEffect(() => {
    loadCertificates();
    loadLogs();
    loadInstructors();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/login?message=session-ended";
      } else {
        alert("Çıkış yapılamadı");
      }
    } catch (error) {
      console.error(error);
      alert("Logout sırasında hata oluştu");
    }
  }

  async function updateStatus(id: string, status: string, reason?: string) {
    try {
      setUpdatingStatusId(id);

      const res = await fetch(`/api/certificates/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status,
          reason: reason || null,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Status değiştirilemedi");
        return;
      }

      await loadCertificates();
      await loadLogs();
    } catch (error) {
      console.error("Update status error:", error);
      alert("Status güncellenemedi");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function handleGenerateCard(certificateId: string) {
    try {
      setGeneratingCardId(certificateId);

      const res = await fetch("/api/generate-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ certificateId }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Kart üretilemedi");
        return;
      }

      await loadCertificates();
      await loadLogs();

      if (data.cardFrontUrl) {
        window.open(data.cardFrontUrl, "_blank");
      }

      alert("Kart başarıyla oluşturuldu");
    } catch (error) {
      console.error("handleGenerateCard error:", error);
      alert("Kart oluşturulurken hata oluştu");
    } finally {
      setGeneratingCardId(null);
    }
  }

  async function createCertificate() {
  try {
    setLoading(true);

    if (!fullName.trim()) {
      alert("Full name gerekli");
      return;
    }

    if (!qualificationLevel.trim()) {
      alert("Qualification level gerekli");
      return;
    }

    if (!selectedInstructorId) {
      alert("Instructor seçmelisin");
      return;
    }

    if (seaMiles && Number(seaMiles) < 0) {
      alert("Sea miles negatif olamaz");
      return;
    }

    let photoUrl: string | null = null;

    if (photo) {
      const photoFormData = new FormData();

      photoFormData.append("file", photo);
      photoFormData.append("folder", "students");

      const photoRes = await fetch("/api/upload-photo", {
        method: "POST",
        body: photoFormData,
        credentials: "include",
      });

      if (photoRes.status === 401) {
        window.location.href = "/login";
        return;
      }

      const photoData = await photoRes.json();

      if (!photoRes.ok || !photoData.success) {
        alert(photoData.error || "Fotoğraf yüklenemedi");
        return;
      }

      photoUrl = photoData.url;
    }

    await createCertificateAction({
      fullName: fullName.trim(),
      program,
      qualificationLevel,
      issueDate,
      seaMiles,
      instructorId: selectedInstructorId || "",
      photoUrl: photoUrl || null,
    });

    await loadCertificates();
    await loadLogs();

    alert("Sertifika + kart başarıyla oluşturuldu");
  } catch (error) {
    console.error("createCertificate error:", error);
    alert("Beklenmeyen bir hata oluştu");
  } finally {
    setLoading(false);
  }
}

  async function copyVerifyLink(certificateId: string) {
    try {
      const verifyUrl = `${window.location.origin}${getVerifyPath(
        certificateId
      )}`;

      await navigator.clipboard.writeText(verifyUrl);
      alert("Verify link kopyalandı");
    } catch (error) {
      console.error(error);
      alert("Verify link kopyalanamadı");
    }
  }

  function scrollToCreateForm() {
    const target = document.getElementById("create-certificate-section");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function openLatestVerify() {
    if (!items.length) {
      alert("Henüz sertifika kaydı yok");
      return;
    }

    window.open(getVerifyPath(items[0].certificateId), "_blank");
  }

  const filteredItems = useMemo(() => {
    const term = normalizeText(searchTerm);

    return items.filter((item) => {
      const matchesSearch =
        !term ||
        normalizeText(item.fullName).includes(term) ||
        normalizeText(item.certificateId).includes(term) ||
        normalizeText(item.program).includes(term) ||
        normalizeText(item.qualificationLevel).includes(term) ||
        normalizeText(item.instructor?.fullName).includes(term);

      const matchesProgram =
        programFilter === "ALL" || item.program === programFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        getStatusLabel(item.status) === statusFilter.toUpperCase();

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [items, programFilter, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: items.length,
      filtered: filteredItems.length,
      active: items.filter((item) => getStatusLabel(item.status) === "ACTIVE")
        .length,
      pending: items.filter((item) => getStatusLabel(item.status) === "PENDING")
        .length,
      revoked: items.filter((item) => getStatusLabel(item.status) === "REVOKED")
        .length,
      hashed: items.filter((item) => !!item.verificationHash).length,
    };
  }, [items, filteredItems]);

  const systemStatus = loadingList || loadingLogs ? "SYNCING" : "ONLINE";

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}>
        <div>
          <div style={brandBoxStyle}>
            <div style={brandMarkStyle}>AS</div>
            <div>
              <div style={brandTitleStyle}>Albatros Sailing</div>
              <div style={brandSubStyle}>Certificate OS</div>
            </div>
          </div>

          <nav style={navStyle}>
            <button onClick={scrollToCreateForm} style={navButtonStyle}>
              Create Certificate
            </button>
            <button onClick={loadCertificates} style={navButtonStyle}>
              Refresh Records
            </button>
            <button onClick={openLatestVerify} style={navButtonStyle}>
              Latest Verify
            </button>
          </nav>
        </div>

        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </aside>

      <section style={contentStyle}>
        <section style={heroSectionStyle}>
          <div>
            <div style={heroEyebrowStyle}>Premium Admin Control Panel</div>
            <h1 style={heroTitleStyle}>Certificate Command Center</h1>
            <p style={heroTextStyle}>
              Sertifika üretimi, doğrulama, kart ön/arka yüzleri, PDF işlemleri,
              durum yönetimi ve audit kayıtları tek premium panelden yönetilir.
            </p>
          </div>

          <div style={heroStatsWrapStyle}>
            <TopStatusCard label="System" value={systemStatus} />
            <TopStatusCard label="Records" value={String(counts.total)} />
            <TopStatusCard label="Active" value={String(counts.active)} />
            <TopStatusCard label="Hashed" value={String(counts.hashed)} />
          </div>
        </section>

        <section style={dashboardGridStyle}>
          <MetricCard label="Total Records" value={counts.total} tone="blue" />
          <MetricCard label="Active Certificates" value={counts.active} tone="green" />
          <MetricCard label="Pending" value={counts.pending} tone="amber" />
          <MetricCard label="Revoked" value={counts.revoked} tone="red" />
        </section>

        <section id="create-certificate-section" style={panelStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallCapsStyle}>Production Workflow</div>
              <h2 style={panelTitleStyle}>Create Certificate</h2>
            </div>

            <button
              onClick={createCertificate}
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Certificate"}
            </button>
          </div>

          <div style={formGridStyle}>
            <Field label="Full Name">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Student full name"
                style={inputStyle}
              />
            </Field>

            <Field label="Program">
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                style={inputStyle}
              >
                {programOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Qualification Level">
              <select
                value={qualificationLevel}
                onChange={(e) => setQualificationLevel(e.target.value)}
                style={inputStyle}
              >
                {qualificationOptions.map((level) => (
                  <option key={level} value={level}>
                    {YES_LABELS[level] ? `${level} — ${YES_LABELS[level]}` : level}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Issue Date">
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Sea Miles">
              <input
                type="number"
                value={seaMiles}
                onChange={(e) => setSeaMiles(e.target.value)}
                placeholder="890"
                style={inputStyle}
              />
            </Field>

            <Field label="Instructor">
              <select
                value={selectedInstructorId || ""}
                onChange={(e) => setSelectedInstructorId(e.target.value || null)}
                style={inputStyle}
              >
                <option value="">
                  {loadingInstructors ? "Loading instructors..." : "Instructor seç"}
                </option>

                {instructors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                    {item.title ? ` — ${item.title}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Student Photo">
              <input
                ref={photoInputRef}
                id="student-photo-input"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                style={inputStyle}
              />

              {photo ? (
                <div style={photoPreviewWrapStyle}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Preview"
                    style={photoPreviewStyle}
                  />
                  <div style={photoNameStyle}>{photo.name}</div>
                </div>
              ) : null}
            </Field>
          </div>
        </section>

        <section style={panelStyle}>
          <div style={filtersGridStyle}>
            <Field label="Search">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İsim, ID, program, seviye veya instructor ara"
                style={inputStyle}
              />
            </Field>

            <Field label="Program Filter">
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="ALL">All Programs</option>
                {programOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status Filter">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="REVOKED">REVOKED</option>
                <option value="UNKNOWN">UNKNOWN</option>
              </select>
            </Field>

            <button onClick={loadCertificates} style={secondaryButtonStyle}>
              {loadingList ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div style={summaryWrapStyle}>
            <SummaryBadge label="Total" value={counts.total} />
            <SummaryBadge label="Filtered" value={counts.filtered} />
            <SummaryBadge label="Active" value={counts.active} />
            <SummaryBadge label="Pending" value={counts.pending} />
            <SummaryBadge label="Revoked" value={counts.revoked} />
            <SummaryBadge label="Hashed" value={counts.hashed} />
          </div>
        </section>

        <section style={twoColumnGridStyle}>
          <section style={panelStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={smallCapsStyle}>Live Registry</div>
                <h2 style={panelTitleStyle}>Certificates</h2>
              </div>

              <div style={sectionMetaTextStyle}>
                {counts.filtered} kayıt gösteriliyor
              </div>
            </div>

            {filteredItems.length === 0 && !loadingList ? (
              <p style={emptyTextStyle}>No matching certificate records found.</p>
            ) : null}

            <div style={{ display: "grid", gap: 18 }}>
              {filteredItems.map((item) => {
                const statusMeta = getStatusMeta(item.status);
                const securityMeta = getSecurityMeta(item);
                const currentStatus = getStatusLabel(item.status);
                const isRevoked = currentStatus === "REVOKED";
                const isUpdating = updatingStatusId === item.id;
                const isGenerating = generatingCardId === item.certificateId;

                const liveFrontUrl = item.cardFrontUrl || "";
const liveBackUrl = item.cardBackUrl || "";

                return (
                  <article key={item.id} style={certificateCardStyle}>
                    <div style={certificateTopStyle}>
                      <div>
                        <div style={badgesRowStyle}>
                          <h3 style={cardTitleStyle}>{item.fullName}</h3>

                          <StatusBadge
                            label={statusMeta.label}
                            color={statusMeta.color}
                            bg={statusMeta.bg}
                            border={statusMeta.border}
                          />

                          <StatusBadge
                            label={securityMeta.label}
                            color={securityMeta.color}
                            bg={securityMeta.bg}
                            border={securityMeta.border}
                          />
                        </div>

                        <div style={detailsGridStyle}>
                          <DetailRow label="ID" value={item.certificateId} />
                          <DetailRow label="Program" value={item.program || "-"} />
                          <DetailRow
                            label="Level"
                            value={item.qualificationLevel || "-"}
                          />
                          <DetailRow
                            label="Issue Date"
                            value={formatDate(item.issueDate)}
                          />
                          <DetailRow
                            label="Sea Miles"
                            value={
                              typeof item.seaMiles === "number"
                                ? `${item.seaMiles} NM`
                                : "-"
                            }
                          />
                          <DetailRow label="Status" value={currentStatus} />
                          <DetailRow
                            label="Instructor"
                            value={item.instructor?.fullName || "-"}
                          />
                          <DetailRow
                            label="Verification Hash"
                            value={getHashPreview(item.verificationHash)}
                          />
                        </div>
                      </div>

                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.fullName}
                          style={photoStyle}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-user.png";
                          }}
                        />
                      ) : null}
                    </div>

                    <div style={buttonsWrapStyle}>
                      <button
                        onClick={() => handleGenerateCard(item.certificateId)}
                        disabled={isGenerating}
                        style={{
                          ...primaryButtonStyle,
                          opacity: isGenerating ? 0.65 : 1,
                          cursor: isGenerating ? "not-allowed" : "pointer",
                        }}
                      >
                        {isGenerating ? "Generating..." : "Kart Üret"}
                      </button>

                      <button
                        onClick={() => window.open(liveFrontUrl, "_blank")}
                        style={secondaryButtonStyle}
                      >
                        Live Front
                      </button>

                      <button
                        onClick={() => window.open(liveBackUrl, "_blank")}
                        style={secondaryButtonStyle}
                      >
                        Live Back
                      </button>

                      {item.cardFrontUrl ? (
                        <button
                          onClick={() => window.open(item.cardFrontUrl!, "_blank")}
                          style={secondaryButtonStyle}
                        >
                          Stored Front
                        </button>
                      ) : null}

                      {item.cardBackUrl ? (
                        <button
                          onClick={() => window.open(item.cardBackUrl!, "_blank")}
                          style={secondaryButtonStyle}
                        >
                          Stored Back
                        </button>
                      ) : null}

                      <button
                        onClick={() =>
                          window.open(getVerifyPath(item.certificateId), "_blank")
                        }
                        style={secondaryButtonStyle}
                      >
                        Open Verify
                      </button>

                      <button
                        onClick={() => copyVerifyLink(item.certificateId)}
                        style={secondaryButtonStyle}
                      >
                        Copy Verify Link
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            setPrintingId(item.certificateId);

                            const res = await fetch(
                              "/api/certificates/print-card",
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                  certificateId: item.certificateId,
                                }),
                              }
                            );

                            if (!res.ok) {
                              throw new Error("Print failed");
                            }

                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, "_blank");
                          } catch (error) {
                            console.error("Print card error:", error);
                            alert("Card PDF oluşturulamadı");
                          } finally {
                            setPrintingId(null);
                          }
                        }}
                        disabled={printingId === item.certificateId}
                        style={secondaryButtonStyle}
                      >
                        {printingId === item.certificateId
                          ? "Printing..."
                          : "Download Card PDF"}
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            `/api/certificates/export-certificate-pdf?certificateId=${encodeURIComponent(
                              item.certificateId
                            )}`,
                            "_blank"
                          )
                        }
                        style={primaryButtonStyle}
                      >
                        A4 Certificate
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "ACTIVE")}
                        disabled={isUpdating || currentStatus === "ACTIVE"}
                        style={{
                          ...statusActionButtonStyle,
                          border: "1px solid #22c55e",
                          background:
                            currentStatus === "ACTIVE"
                              ? "rgba(34,197,94,0.08)"
                              : "rgba(34,197,94,0.14)",
                          color: "#22c55e",
                          opacity:
                            isUpdating || currentStatus === "ACTIVE" ? 0.62 : 1,
                        }}
                      >
                        {isUpdating ? "Updating..." : "Set Active"}
                      </button>

                      <button
                        onClick={() => {
                          if (isRevoked) {
                            updateStatus(item.id, "ACTIVE");
                            return;
                          }

                          const reason = window.prompt(
                            "Revoke nedeni girin:",
                            "Manual revoke"
                          );

                          if (!reason || !reason.trim()) return;

                          updateStatus(item.id, "REVOKED", reason.trim());
                        }}
                        disabled={isUpdating}
                        style={{
                          ...statusActionButtonStyle,
                          border: isRevoked
                            ? "1px solid #22c55e"
                            : "1px solid #ef4444",
                          background: isRevoked
                            ? "rgba(34,197,94,0.14)"
                            : "rgba(239,68,68,0.14)",
                          color: isRevoked ? "#22c55e" : "#ef4444",
                          opacity: isUpdating ? 0.62 : 1,
                        }}
                      >
                        {isUpdating
                          ? "Updating..."
                          : isRevoked
                            ? "Restore"
                            : "Revoke"}
                      </button>
                    </div>

                    <div style={previewGridStyle}>
                      <PreviewImage title="Live Front Side" src={liveFrontUrl} />
                      <PreviewImage title="Live Back Side" src={liveBackUrl} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section style={panelStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={smallCapsStyle}>Audit Trail</div>
                <h2 style={panelTitleStyle}>Activity Log</h2>
              </div>

              <button onClick={loadLogs} style={secondaryButtonStyle}>
                {loadingLogs ? "Refreshing..." : "Refresh Logs"}
              </button>
            </div>

            {logs.length === 0 && !loadingLogs ? (
              <p style={emptyTextStyle}>Henüz log kaydı yok.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {logs.map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TopStatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={topStatusCardStyle}>
      <div style={topStatusLabelStyle}>{label}</div>
      <div style={topStatusValueStyle}>{value}</div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "green" | "amber" | "red";
}) {
  const color =
    tone === "green"
      ? "#22c55e"
      : tone === "amber"
        ? "#f59e0b"
        : tone === "red"
          ? "#ef4444"
          : "#38bdf8";

  return (
    <div style={metricCardStyle}>
      <div style={{ ...metricGlowStyle, background: color }} />
      <div style={metricLabelStyle}>{label}</div>
      <div style={metricValueStyle}>{value}</div>
    </div>
  );
}

function SummaryBadge({ label, value }: { label: string; value: number }) {
  return (
    <div style={summaryBadgeStyle}>
      <strong>{label}:</strong> {value}
    </div>
  );
}

function StatusBadge({
  label,
  color,
  bg,
  border,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: 0.5,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          boxShadow: `0 0 14px ${color}`,
        }}
      />
      {label}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={detailBoxStyle}>
      <div style={detailLabelStyle}>{label}</div>
      <div style={detailValueStyle}>{value}</div>
    </div>
  );
}

function PreviewImage({ title, src }: { title: string; src: string }) {
  return (
    <div>
      <div style={previewTitleStyle}>{title}</div>
      <div style={previewBoxStyle}>
        <img
          src={src}
          alt={title}
          style={previewImageStyle}
          onError={(e) => {
            e.currentTarget.src = "/placeholder-card.png";
          }}
        />
      </div>
    </div>
  );
}

function LogCard({ log }: { log: AdminLogItem }) {
  let parsed: any = null;

  try {
    parsed = log.details ? JSON.parse(log.details) : null;
  } catch {
    parsed = null;
  }

  return (
    <div style={logCardStyle}>
      <div style={logTopStyle}>
        <strong style={{ color: "#38bdf8" }}>{log.action}</strong>
        <span style={logTimeStyle}>{formatDateTime(log.createdAt)}</span>
      </div>

      <div style={logContentStyle}>
        <div>
          <strong>Target:</strong> {log.targetType || "-"}
        </div>
        <div>
          <strong>ID:</strong> {log.targetId || "-"}
        </div>

        {parsed?.fullName ? (
          <div>
            <strong>Name:</strong> {parsed.fullName}
          </div>
        ) : null}

        {parsed?.certificateId ? (
          <div>
            <strong>Certificate:</strong> {parsed.certificateId}
          </div>
        ) : null}

        {parsed?.newStatus ? (
          <div>
            <strong>Status:</strong> {parsed.newStatus}
          </div>
        ) : null}

        {parsed?.revokeReason ? (
          <div style={{ color: "#f87171" }}>
            <strong>Reason:</strong> {parsed.revokeReason}
          </div>
        ) : null}

        {!parsed && log.details ? (
          <div>
            <strong>Details:</strong> {log.details}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "280px 1fr",
  background:
    "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 28%), linear-gradient(135deg, #050914 0%, #07111f 42%, #0b1220 100%)",
  color: "#e2e8f0",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const sidebarStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  height: "100vh",
  padding: 22,
  borderRight: "1px solid rgba(148,163,184,0.14)",
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.96))",
  backdropFilter: "blur(18px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const contentStyle: CSSProperties = {
  padding: 26,
  maxWidth: 1500,
  width: "100%",
  boxSizing: "border-box",
};

const brandBoxStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 26,
};

const brandMarkStyle: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  fontWeight: 900,
  color: "#07111d",
  background: "linear-gradient(135deg, #67e8f9, #38bdf8, #0ea5e9)",
  boxShadow: "0 18px 40px rgba(56,189,248,0.20)",
};

const brandTitleStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  color: "#f8fafc",
};

const brandSubStyle: CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  color: "#94a3b8",
  letterSpacing: 0.5,
};

const navStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const navButtonStyle: CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.12)",
  background: "rgba(255,255,255,0.035)",
  color: "#cbd5e1",
  cursor: "pointer",
  fontWeight: 800,
};

const logoutButtonStyle: CSSProperties = {
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid rgba(254,202,202,0.28)",
  background: "rgba(127,29,29,0.22)",
  color: "#fecaca",
  cursor: "pointer",
  fontWeight: 900,
};

const heroSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 20,
  alignItems: "center",
  border: "1px solid rgba(148,163,184,0.16)",
  borderRadius: 28,
  padding: 26,
  marginBottom: 24,
  background:
    "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(30,64,175,0.12)), rgba(15,23,42,0.78)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
};

const heroEyebrowStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 1.6,
  textTransform: "uppercase",
  color: "#7dd3fc",
  marginBottom: 10,
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 34,
  lineHeight: 1.05,
  letterSpacing: -0.8,
  color: "#f8fafc",
};

const heroTextStyle: CSSProperties = {
  margin: "12px 0 0",
  color: "#b6c3d3",
  maxWidth: 780,
  lineHeight: 1.7,
};

const heroStatsWrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
  gap: 10,
};

const topStatusCardStyle: CSSProperties = {
  minWidth: 120,
  padding: "14px 15px",
  borderRadius: 18,
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const topStatusLabelStyle: CSSProperties = {
  fontSize: 10,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: 1.2,
  marginBottom: 7,
  fontWeight: 900,
};

const topStatusValueStyle: CSSProperties = {
  fontSize: 17,
  color: "#ffffff",
  fontWeight: 900,
};

const dashboardGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const metricCardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(148,163,184,0.16)",
  borderRadius: 22,
  padding: 20,
  background: "rgba(15,23,42,0.82)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
};

const metricGlowStyle: CSSProperties = {
  position: "absolute",
  right: -30,
  top: -30,
  width: 90,
  height: 90,
  borderRadius: "999px",
  opacity: 0.22,
  filter: "blur(10px)",
};

const metricLabelStyle: CSSProperties = {
  position: "relative",
  fontSize: 12,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: 1.1,
  fontWeight: 900,
};

const metricValueStyle: CSSProperties = {
  position: "relative",
  marginTop: 12,
  fontSize: 34,
  lineHeight: 1,
  fontWeight: 950,
  color: "#f8fafc",
};

const panelStyle: CSSProperties = {
  border: "1px solid rgba(148,163,184,0.15)",
  borderRadius: 24,
  padding: 22,
  marginBottom: 24,
  background: "rgba(15,23,42,0.84)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 20px 70px rgba(0,0,0,0.20)",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
  marginBottom: 18,
};

const smallCapsStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  color: "#38bdf8",
  letterSpacing: 1.5,
  textTransform: "uppercase",
  marginBottom: 6,
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  color: "#f8fafc",
  fontSize: 23,
  letterSpacing: -0.3,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,
};

const filtersGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr auto",
  gap: 14,
  alignItems: "end",
};

const twoColumnGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.75fr) minmax(330px, 0.85fr)",
  gap: 24,
  alignItems: "start",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 900,
  fontSize: 12,
  letterSpacing: 0.8,
  textTransform: "uppercase",
  color: "#94a3b8",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(2,6,23,0.44)",
  color: "#f8fafc",
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  color: "#06101d",
  cursor: "pointer",
  fontWeight: 950,
  boxShadow: "0 16px 38px rgba(56,189,248,0.18)",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "rgba(30,41,59,0.62)",
  color: "#f8fafc",
  cursor: "pointer",
  fontWeight: 850,
};

const statusActionButtonStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 900,
  background: "transparent",
};

const summaryWrapStyle: CSSProperties = {
  marginTop: 18,
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const summaryBadgeStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(30,41,59,0.68)",
  border: "1px solid rgba(148,163,184,0.15)",
  fontSize: 13,
  color: "#e2e8f0",
};

const sectionMetaTextStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: 14,
  fontWeight: 700,
};

const certificateCardStyle: CSSProperties = {
  border: "1px solid rgba(148,163,184,0.15)",
  borderRadius: 24,
  padding: 20,
  background:
    "linear-gradient(180deg, rgba(30,41,59,0.54), rgba(15,23,42,0.9))",
  boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
};

const certificateTopStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 16,
  alignItems: "start",
};

const badgesRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 14,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  color: "#f8fafc",
  fontSize: 22,
  letterSpacing: -0.4,
};

const detailsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const detailBoxStyle: CSSProperties = {
  border: "1px solid rgba(148,163,184,0.11)",
  borderRadius: 14,
  padding: "12px 14px",
  background: "rgba(2,6,23,0.28)",
};

const detailLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 900,
  color: "#94a3b8",
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 8,
};

const detailValueStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#e2e8f0",
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const buttonsWrapStyle: CSSProperties = {
  marginTop: 18,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const previewGridStyle: CSSProperties = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const previewTitleStyle: CSSProperties = {
  marginBottom: 8,
  fontWeight: 900,
  fontSize: 13,
  color: "#e2e8f0",
};

const previewBoxStyle: CSSProperties = {
  border: "1px solid rgba(148,163,184,0.14)",
  borderRadius: 16,
  padding: 10,
  background: "rgba(2,6,23,0.38)",
  minHeight: 190,
  display: "grid",
  placeItems: "center",
};

const previewImageStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  objectFit: "contain",
  borderRadius: 12,
};

const photoStyle: CSSProperties = {
  width: 124,
  height: 154,
  objectFit: "cover",
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "#0f172a",
  boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
};

const photoPreviewWrapStyle: CSSProperties = {
  marginTop: 12,
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const photoPreviewStyle: CSSProperties = {
  width: 82,
  height: 100,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "#0f172a",
};

const photoNameStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: 13,
  wordBreak: "break-word",
};

const logCardStyle: CSSProperties = {
  border: "1px solid rgba(148,163,184,0.13)",
  borderRadius: 16,
  padding: 14,
  background: "rgba(2,6,23,0.32)",
};

const logTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 8,
};

const logTimeStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: 12,
};

const logContentStyle: CSSProperties = {
  fontSize: 13,
  color: "#cbd5e1",
  lineHeight: 1.7,
};

const emptyTextStyle: CSSProperties = {
  margin: 0,
  color: "#94a3b8",
};