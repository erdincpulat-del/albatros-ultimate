"use client";

import { useEffect, useMemo, useState } from "react";

type AdminLog = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string | null;
  createdAt: string;
};

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function tryFormatJson(value?: string | null) {
  if (!value) return "-";

  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [targetTypeFilter, setTargetTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  async function fetchLogs() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin-logs", {
        cache: "no-store",
      });

      const data = await res.json();
      setLogs(Array.isArray(data?.logs) ? data.logs : []);
    } catch (error) {
      console.error("Admin logs fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const actionOptions = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.action))).sort((a, b) =>
      a.localeCompare(b, "tr")
    );
  }, [logs]);

  const targetTypeOptions = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.targetType))).sort((a, b) =>
      a.localeCompare(b, "tr")
    );
  }, [logs]);

  const filteredLogs = useMemo(() => {
    let next = logs;

    if (actionFilter !== "ALL") {
      next = next.filter((log) => log.action === actionFilter);
    }

    if (targetTypeFilter !== "ALL") {
      next = next.filter((log) => log.targetType === targetTypeFilter);
    }

    if (search.trim()) {
      const s = search.toLowerCase();

      next = next.filter((log) => {
        return (
          log.action?.toLowerCase().includes(s) ||
          log.targetType?.toLowerCase().includes(s) ||
          log.targetId?.toLowerCase().includes(s) ||
          log.details?.toLowerCase().includes(s)
        );
      });
    }

    return next;
  }, [logs, actionFilter, targetTypeFilter, search]);

  function clearFilters() {
    setActionFilter("ALL");
    setTargetTypeFilter("ALL");
    setSearch("");
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Albatros Sailing
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Admin Log Kayıtları
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Sistemde yapılan kritik işlemleri izleyin. Tekne oluşturma, inquiry
              status güncelleme ve diğer yönetim aksiyonları burada listelenir.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Arama
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="action, targetType, targetId, details..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              >
                <option value="ALL">Tümü</option>
                {actionOptions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Target Type
              </label>
              <select
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950"
              >
                <option value="ALL">Tümü</option>
                {targetTypeOptions.map((targetType) => (
                  <option key={targetType} value={targetType}>
                    {targetType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchLogs}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
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
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-500">Yükleniyor...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-slate-500">Log kaydı bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredLogs.map((log) => (
                <article
                  key={log.id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                          {log.action}
                        </span>

                        <span className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                          {log.targetType}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <InfoBox label="Target ID" value={log.targetId} mono />
                        <InfoBox
                          label="Tarih"
                          value={formatDateTime(log.createdAt)}
                        />
                        <InfoBox label="Log ID" value={log.id} mono />
                      </div>

                      <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Details
                        </div>

                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-700">
                          {tryFormatJson(log.details)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
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