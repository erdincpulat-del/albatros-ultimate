"use client";

import { useEffect, useMemo, useState } from "react";

type Inquiry = {
  id: string;
  type: string;
  status: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  trainingProgram: string | null;
  experienceLevel: string | null;
  preferredMonth: string | null;
  participantCount: number | null;
  charterWeekId: string | null;
  charterStartDate: string | null;
  charterEndDate: string | null;
  charterDurationWeeks: number | null;
  guestCount: number | null;
  routePreference: string | null;
  boatPreference: string | null;
  skipperRequired: boolean | null;
  createdAt: string;
  leadScore: number;
  estimatedValue: number;
  charterWeek?: {
    id: string;
    weekLabel: string;
    startDate: string;
    endDate: string;
    status: string;
    boat?: {
      id: string;
      name: string;
      model: string;
    } | null;
  } | null;
};

type FilterType = "ALL" | "TRAINING" | "CHARTER";
type StatusType = "NEW" | "CONTACTED" | "QUOTED" | "CONFIRMED" | "CANCELLED";
type SortType = "score" | "value" | "date";
type ViewMode = "LIST" | "KANBAN";

const STATUS_OPTIONS: StatusType[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONFIRMED",
  "CANCELLED",
];

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function normalizePhoneForWhatsApp(phone?: string | null) {
  if (!phone) return "";
  return phone.replace(/[^\d]/g, "");
}

function getTypeBadgeClasses(type: string) {
  if (type === "CHARTER") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function getStatusBadgeClasses(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "CONTACTED":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "QUOTED":
      return "bg-purple-50 text-purple-700 ring-purple-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function getInquiryBoatName(item: Inquiry) {
  return item.charterWeek?.boat?.name || item.boatPreference || "";
}

function getLeadLabel(score: number) {
  if (score >= 70) return "HOT";
  if (score >= 40) return "WARM";
  return "COLD";
}

function getLeadTierClasses(score: number) {
  if (score >= 70) return "bg-rose-100 text-rose-700 ring-rose-200";
  if (score >= 40) return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function getLeadScoreClasses(score: number) {
  if (score >= 70) return "bg-rose-100 text-rose-700";
  if (score >= 40) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function buildSmartWhatsAppMessage(item: Inquiry) {
  const name = item.fullName || "Merhaba";
  const leadType = getLeadLabel(item.leadScore);
  const boatName = getInquiryBoatName(item);
  const weekLabel = item.charterWeek?.weekLabel || "";
  const trainingProgram = item.trainingProgram || "";
  const preferredMonth = item.preferredMonth || "";
  const routePreference = item.routePreference || "";
  const guestCount = item.guestCount ? `${item.guestCount} kişi` : "";
  const participantCount = item.participantCount
    ? `${item.participantCount} katılımcı`
    : "";
  const valueSummary = `€${item.estimatedValue.toLocaleString("tr-TR")}`;

  if (item.type === "CHARTER") {
    if (leadType === "HOT") {
      return `Merhaba ${name},

Albatros Sailing charter talebinizi detaylı inceledim.

📊 Lead Seviyesi: ${leadType} (${item.leadScore})
💰 Tahmini Değer: ${valueSummary}
${boatName ? `⛵ Tekne: ${boatName}` : ""}
${weekLabel ? `📅 Hafta: ${weekLabel}` : ""}
${guestCount ? `👥 Misafir: ${guestCount}` : ""}
${routePreference ? `🧭 Rota: ${routePreference}` : ""}

Sizin için en uygun opsiyonu hızlıca netleştirebilirim. Uygunsanız hemen detayları kapatalım.`;
    }

    if (leadType === "WARM") {
      return `Merhaba ${name},

Albatros Sailing charter talebinizi aldım.

${boatName ? `⛵ Tekne: ${boatName}` : ""}
${weekLabel ? `📅 Hafta: ${weekLabel}` : ""}
${guestCount ? `👥 Misafir: ${guestCount}` : ""}
${routePreference ? `🧭 Rota: ${routePreference}` : ""}

Uygunluk ve fiyat bilgilerini paylaşabilirim. İsterseniz size en doğru seçeneği birlikte netleştirelim.`;
    }

    return `Merhaba ${name},

Charter talebiniz bize ulaştı.

${boatName ? `⛵ Tekne: ${boatName}` : ""}
${weekLabel ? `📅 Hafta: ${weekLabel}` : ""}

İsterseniz uygunluk ve genel seçenekleri sizinle paylaşabilirim.`;
  }

  if (leadType === "HOT") {
    return `Merhaba ${name},

Albatros Sailing eğitim talebinizi detaylı inceledim.

📊 Lead Seviyesi: ${leadType} (${item.leadScore})
💰 Tahmini Değer: ${valueSummary}
${trainingProgram ? `🎓 Program: ${trainingProgram}` : ""}
${preferredMonth ? `📅 Dönem: ${preferredMonth}` : ""}
${participantCount ? `👥 Katılımcı: ${participantCount}` : ""}
${routePreference ? `🧭 Rota Tercihi: ${routePreference}` : ""}

Sizin için en uygun program ve kontenjanı hızlıca netleştirebilirim. Uygunsanız hemen ilerleyelim.`;
  }

  if (leadType === "WARM") {
    return `Merhaba ${name},

Albatros Sailing eğitim talebinizi aldım.

${trainingProgram ? `🎓 Program: ${trainingProgram}` : ""}
${preferredMonth ? `📅 Dönem: ${preferredMonth}` : ""}
${participantCount ? `👥 Katılımcı: ${participantCount}` : ""}
${routePreference ? `🧭 Rota Tercihi: ${routePreference}` : ""}

Size uygun tarih ve program seçeneklerini paylaşabilirim. Kısa bir planlama yapalım mı?`;
  }

  return `Merhaba ${name},

Eğitim talebiniz bize ulaştı.

${trainingProgram ? `🎓 Program: ${trainingProgram}` : ""}

Size uygun seçenekleri değerlendirebiliriz.`;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedBoatFilter, setSelectedBoatFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("score");
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");
  const [draggedInquiryId, setDraggedInquiryId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<StatusType | null>(null);
  const [exporting, setExporting] = useState(false);

  async function fetchInquiries() {
    try {
      setLoading(true);

      const res = await fetch("/api/inquiries", {
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error("Inquiry fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function updateStatus(id: string, status: StatusType) {
    try {
      setUpdatingId(id);

      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        alert(data?.error || "Status güncellenemedi.");
        return;
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: data.inquiry.status } : item
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDropToStatus(status: StatusType) {
    if (!draggedInquiryId) return;
    const target = inquiries.find((item) => item.id === draggedInquiryId);
    if (!target) return;

    if (target.status === status) {
      setDraggedInquiryId(null);
      setDragOverStatus(null);
      return;
    }

    await updateStatus(draggedInquiryId, status);
    setDraggedInquiryId(null);
    setDragOverStatus(null);
  }

  async function handleExportExcel() {
    try {
      setExporting(true);

      const res = await fetch("/api/inquiries/export", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Excel export başarısız.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "albatros-inquiries.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel export error:", error);
      alert("Excel dışa aktarma sırasında hata oluştu.");
    } finally {
      setExporting(false);
    }
  }

  function clearFilters() {
    setActiveFilter("ALL");
    setSelectedBoatFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setSortBy("score");
  }

  const charterBoatOptions = useMemo(() => {
    const names = inquiries
      .filter((item) => item.type === "CHARTER")
      .map((item) => getInquiryBoatName(item).trim())
      .filter(Boolean);

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "tr"));
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    let next = inquiries;

    if (activeFilter !== "ALL") {
      next = next.filter((item) => item.type === activeFilter);
    }

    if (selectedBoatFilter !== "ALL") {
      next = next.filter(
        (item) =>
          item.type === "CHARTER" &&
          getInquiryBoatName(item).trim() === selectedBoatFilter
      );
    }

    if (dateFrom) {
      const from = new Date(`${dateFrom}T00:00:00`);
      next = next.filter((item) => {
        const created = new Date(item.createdAt);
        return !Number.isNaN(created.getTime()) && created >= from;
      });
    }

    if (dateTo) {
      const to = new Date(`${dateTo}T23:59:59.999`);
      next = next.filter((item) => {
        const created = new Date(item.createdAt);
        return !Number.isNaN(created.getTime()) && created <= to;
      });
    }

    if (search.trim()) {
      const s = search.toLowerCase();

      next = next.filter((item) => {
        return (
          item.fullName?.toLowerCase().includes(s) ||
          item.email?.toLowerCase().includes(s) ||
          item.phone?.toLowerCase().includes(s) ||
          item.notes?.toLowerCase().includes(s) ||
          item.trainingProgram?.toLowerCase().includes(s) ||
          item.routePreference?.toLowerCase().includes(s) ||
          getInquiryBoatName(item)?.toLowerCase().includes(s)
        );
      });
    }

    if (sortBy === "score") {
      next = [...next].sort((a, b) => b.leadScore - a.leadScore);
    } else if (sortBy === "value") {
      next = [...next].sort((a, b) => b.estimatedValue - a.estimatedValue);
    } else {
      next = [...next].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return next;
  }, [
    activeFilter,
    inquiries,
    selectedBoatFilter,
    dateFrom,
    dateTo,
    search,
    sortBy,
  ]);

  const kanbanColumns = useMemo(() => {
    return STATUS_OPTIONS.map((status) => ({
      status,
      items: filteredInquiries.filter((item) => item.status === status),
    }));
  }, [filteredInquiries]);

  const stats = useMemo(() => {
    const training = inquiries.filter((item) => item.type === "TRAINING").length;
    const charter = inquiries.filter((item) => item.type === "CHARTER").length;
    const fresh = inquiries.filter((item) => item.status === "NEW").length;
    const hot = inquiries.filter((item) => item.leadScore >= 70).length;
    const warm = inquiries.filter(
      (item) => item.leadScore >= 40 && item.leadScore < 70
    ).length;
    const totalEstimatedValue = inquiries.reduce(
      (sum, item) => sum + (item.estimatedValue || 0),
      0
    );

    return {
      total: inquiries.length,
      training,
      charter,
      fresh,
      hot,
      warm,
      totalEstimatedValue,
    };
  }, [inquiries]);

  const topLeads = useMemo(() => {
    return [...inquiries]
      .sort((a, b) => {
        if (b.leadScore !== a.leadScore) return b.leadScore - a.leadScore;
        return b.estimatedValue - a.estimatedValue;
      })
      .slice(0, 5);
  }, [inquiries]);

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Albatros Sailing
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Inquiry Yönetimi
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Eğitim ve charter taleplerini tek ekrandan yönetin. Hızlı dönüş,
                filtreleme, lead önceliği ve satış takibi için optimize edilmiş panel.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-7">
              <StatCard label="Toplam" value={stats.total} />
              <StatCard label="Training" value={stats.training} />
              <StatCard label="Charter" value={stats.charter} />
              <StatCard label="Yeni" value={stats.fresh} />
              <StatCard label="Hot" value={stats.hot} accent="hot" />
              <StatCard label="Warm" value={stats.warm} accent="warm" />
              <StatCard
                label="Toplam €"
                value={`€${stats.totalEstimatedValue.toLocaleString("tr-TR")}`}
              />
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Top Lead Listesi
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              {topLeads.length === 0 ? (
                <span className="text-sm text-slate-500">Henüz kayıt yok.</span>
              ) : (
                topLeads.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    {item.fullName} · {getLeadLabel(item.leadScore)} · {item.leadScore}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <FilterButton
              active={activeFilter === "ALL"}
              onClick={() => setActiveFilter("ALL")}
              label="Tümü"
            />
            <FilterButton
              active={activeFilter === "TRAINING"}
              onClick={() => {
                setActiveFilter("TRAINING");
                setSelectedBoatFilter("ALL");
              }}
              label="Training"
            />
            <FilterButton
              active={activeFilter === "CHARTER"}
              onClick={() => setActiveFilter("CHARTER")}
              label="Charter"
            />

            <button
              type="button"
              onClick={fetchInquiries}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Yenile
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Filtreleri Temizle
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exporting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting ? "Export hazırlanıyor..." : "Excel Export"}
            </button>

            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                viewMode === "LIST"
                  ? "bg-slate-950 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Liste
            </button>

            <button
              type="button"
              onClick={() => setViewMode("KANBAN")}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                viewMode === "KANBAN"
                  ? "bg-slate-950 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Kanban
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Arama
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, telefon, e-posta, tekne, not..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Charter Boat Filtresi
              </label>
              <select
                value={selectedBoatFilter}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedBoatFilter(value);
                  if (value !== "ALL") {
                    setActiveFilter("CHARTER");
                  }
                }}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              >
                <option value="ALL">Tüm tekneler</option>
                {charterBoatOptions.map((boatName) => (
                  <option key={boatName} value={boatName}>
                    {boatName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sıralama
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              >
                <option value="score">Lead Score</option>
                <option value="value">Estimated Value</option>
                <option value="date">Tarih</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-500">Yükleniyor...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-500">Kayıt bulunamadı.</p>
            </div>
          ) : viewMode === "LIST" ? (
            <div className="space-y-5">
              {filteredInquiries.map((item) => (
                <InquiryListCard
                  key={item.id}
                  item={item}
                  updatingId={updatingId}
                  onUpdateStatus={updateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-5">
              {kanbanColumns.map((column) => (
                <div
                  key={column.status}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverStatus(column.status);
                  }}
                  onDragLeave={() => setDragOverStatus(null)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    await handleDropToStatus(column.status);
                  }}
                  className={`rounded-[1.75rem] border bg-white p-4 shadow-sm transition ${
                    dragOverStatus === column.status
                      ? "border-slate-950 ring-2 ring-slate-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ${getStatusBadgeClasses(
                        column.status
                      )}`}
                    >
                      {column.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      {column.items.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    {column.items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400">
                        Kayıt yok
                      </div>
                    ) : (
                      column.items.map((item) => (
                        <InquiryKanbanCard
                          key={item.id}
                          item={item}
                          updatingId={updatingId}
                          onUpdateStatus={updateStatus}
                          onDragStart={(id) => setDraggedInquiryId(id)}
                          onDragEnd={() => {
                            setDraggedInquiryId(null);
                            setDragOverStatus(null);
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InquiryListCard({
  item,
  updatingId,
  onUpdateStatus,
}: {
  item: Inquiry;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: StatusType) => void;
}) {
  const whatsappPhone = normalizePhoneForWhatsApp(item.phone);
  const smartMessage = buildSmartWhatsAppMessage(item);
  const smartWhatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(smartMessage)}`
    : null;

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-950">
              {item.fullName}
            </h2>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ${getTypeBadgeClasses(
                item.type
              )}`}
            >
              {item.type}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ${getStatusBadgeClasses(
                item.status
              )}`}
            >
              {item.status}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ${getLeadTierClasses(
                item.leadScore
              )}`}
            >
              {getLeadLabel(item.leadScore)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getLeadScoreClasses(
                item.leadScore
              )}`}
            >
              Score: {item.leadScore}
            </span>

            <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
              €{item.estimatedValue.toLocaleString("tr-TR")}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoBox label="Telefon" value={item.phone || "-"} />
            <InfoBox label="E-posta" value={item.email || "-"} />
            <InfoBox label="Tarih" value={formatDate(item.createdAt)} />
            <InfoBox label="ID" value={item.id} mono />
          </div>

          {item.type === "TRAINING" ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoBox label="Program" value={item.trainingProgram || "-"} />
              <InfoBox label="Deneyim" value={item.experienceLevel || "-"} />
              <InfoBox
                label="Tercih Dönemi"
                value={item.preferredMonth || "-"}
              />
              <InfoBox
                label="Katılımcı"
                value={item.participantCount ? String(item.participantCount) : "-"}
              />
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoBox
                label="Hafta Kodu"
                value={item.charterWeek?.weekLabel || item.charterWeekId || "-"}
              />
              <InfoBox
                label="Tarih Aralığı"
                value={
                  item.charterStartDate || item.charterEndDate
                    ? `${formatDate(item.charterStartDate)} - ${formatDate(
                        item.charterEndDate
                      )}`
                    : "-"
                }
              />
              <InfoBox
                label="Kişi Sayısı"
                value={item.guestCount ? String(item.guestCount) : "-"}
              />
              <InfoBox
                label="Hafta"
                value={
                  item.charterDurationWeeks
                    ? `${item.charterDurationWeeks} hafta`
                    : "-"
                }
              />
              <InfoBox label="Rota" value={item.routePreference || "-"} />
              <InfoBox label="Tekne" value={getInquiryBoatName(item) || "-"} />
              <InfoBox
                label="Skipper"
                value={
                  item.skipperRequired === null
                    ? "-"
                    : item.skipperRequired
                    ? "Evet"
                    : "Hayır"
                }
              />
              <InfoBox
                label="Hafta Durumu"
                value={item.charterWeek?.status || "-"}
              />
            </div>
          )}

          <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Not
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {item.notes || "-"}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-[260px]">
          {whatsappPhone ? (
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              WhatsApp
            </a>
          ) : null}

          {smartWhatsappUrl ? (
            <a
              href={smartWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-green-700"
            >
              Satış Mesajı Gönder
            </a>
          ) : null}

          {item.email ? (
            <a
              href={`mailto:${item.email}`}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Mail Gönder
            </a>
          ) : null}

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Status Güncelle
            </div>

            <div className="grid grid-cols-1 gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={updatingId === item.id}
                  onClick={() => onUpdateStatus(item.id, status)}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition ${
                    item.status === status
                      ? "bg-slate-950 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {updatingId === item.id && item.status !== status
                    ? "Güncelleniyor..."
                    : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function InquiryKanbanCard({
  item,
  updatingId,
  onUpdateStatus,
  onDragStart,
  onDragEnd,
}: {
  item: Inquiry;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: StatusType) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const whatsappPhone = normalizePhoneForWhatsApp(item.phone);
  const smartMessage = buildSmartWhatsAppMessage(item);
  const smartWhatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(smartMessage)}`
    : null;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(item.id)}
      onDragEnd={onDragEnd}
      className="cursor-grab rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 active:cursor-grabbing"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold text-slate-950">
          {item.fullName}
        </div>

        <span
          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ${getLeadTierClasses(
            item.leadScore
          )}`}
        >
          {getLeadLabel(item.leadScore)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${getLeadScoreClasses(
            item.leadScore
          )}`}
        >
          {item.leadScore}
        </span>

        <span className="inline-flex rounded-full bg-slate-950 px-2 py-1 text-[10px] font-semibold text-white">
          €{item.estimatedValue.toLocaleString("tr-TR")}
        </span>

        <span
          className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ${getTypeBadgeClasses(
            item.type
          )}`}
        >
          {item.type}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <div>{item.phone || "-"}</div>
        <div>{item.email || "-"}</div>
        <div>{getInquiryBoatName(item) || item.trainingProgram || "-"}</div>
        <div>{formatDate(item.createdAt)}</div>
      </div>

      {item.notes ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-600">
          {item.notes}
        </div>
      ) : null}

      <div className="mt-3 flex flex-col gap-2">
        {whatsappPhone ? (
          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            onClick={(e) => e.stopPropagation()}
          >
            WhatsApp
          </a>
        ) : null}

        {smartWhatsappUrl ? (
          <a
            href={smartWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
            onClick={(e) => e.stopPropagation()}
          >
            Satış Mesajı
          </a>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            disabled={updatingId === item.id}
            onClick={() => onUpdateStatus(item.id, status)}
            className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-[11px] font-semibold transition ${
              item.status === status
                ? "bg-slate-950 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {updatingId === item.id && item.status !== status
              ? "Güncelleniyor..."
              : status}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: number | string;
  accent?: "default" | "hot" | "warm";
}) {
  const accentClasses =
    accent === "hot"
      ? "border-rose-200 bg-rose-50"
      : accent === "warm"
      ? "border-amber-200 bg-amber-50"
      : "border-slate-200 bg-slate-50";

  return (
    <div className={`rounded-[1.25rem] border px-4 py-4 ${accentClasses}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function InfoBox({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div
        className={`mt-2 break-words text-sm text-slate-900 ${
          mono ? "font-mono" : "font-medium"
        }`}
      >
        {value}
      </div>
    </div>
  );
}