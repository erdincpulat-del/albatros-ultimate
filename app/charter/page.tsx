"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";

type CharterBoat = {
  slug: string;
  name: string;
  image: string;
  cabins: string;
  year: string;
  categoryTr: string;
  categoryEn: string;
  shortTr: string;
  shortEn: string;
};

export default function CharterPage() {
  const { locale } = useLanguage();
  const isTR = locale === "tr";

  const boats: CharterBoat[] = [
    {
      slug: "bali-44-2024",
      name: "BALI 44",
      image: "/boats/bali-44.jpg",
      cabins: "4 Kabin",
      year: "2024",
      categoryTr: "Tekne Kiralama",
      categoryEn: "Boat Charter",
      shortTr: "Yeni nesil katamaran konforu ve geniş yaşam alanı.",
      shortEn: "New generation catamaran comfort with wide living space.",
    },
    {
      slug: "bavaria-45-AURA1",
      name: "BAVARIA 45 – AURA1",
      image: "/boats/bavaria-45.jpg",
      cabins: "4 Kabin",
      year: "2011",
      categoryTr: "Tekne Kiralama",
      categoryEn: "Boat Charter",
      shortTr: "Dengeli yapı, konforlu kullanım ve klasik Bavaria güveni.",
      shortEn: "Balanced structure, comfortable handling, and classic Bavaria reliability.",
    },
    {
      slug: "bavaria-46-2022",
      name: "BAVARIA 46",
      image: "/boats/bavaria-46-2022.jpg",
      cabins: "4 Kabin",
      year: "2022",
      categoryTr: "Tekne Kiralama",
      categoryEn: "Boat Charter",
      shortTr: "Modern çizgi, güçlü gövde yapısı ve ferah seyir deneyimi.",
      shortEn: "Modern lines, strong hull structure, and spacious sailing experience.",
    },
    {
      slug: "bavaria-46-2024",
      name: "BAVARIA 46",
      image: "/boats/bavaria-46-2024.jpg",
      cabins: "4 Kabin",
      year: "2024",
      categoryTr: "Tekne Kiralama",
      categoryEn: "Boat Charter",
      shortTr: "Yeni model, yüksek konfor ve premium charter hissi.",
      shortEn: "New model, high comfort, and a premium charter feel.",
    },
    {
      slug: "beneteau-oceanis-41-2016",
      name: "BENETEAU OCEANIS 41",
      image: "/boats/beneteau-oceanis-41.jpg",
      cabins: "3 Kabin",
      year: "2016",
      categoryTr: "Tekne Kiralama",
      categoryEn: "Boat Charter",
      shortTr: "Akıcı seyir karakteri ve keyifli yelken performansı.",
      shortEn: "Smooth sailing character and enjoyable sailing performance.",
    },
    {
      slug: "elan-400-2013",
      name: "SAFINAZ",
      image: "/boats/elan-400.jpg",
      cabins: "3 Kabin",
      year: "2013",
      categoryTr: "Tekne Kiralama",
      categoryEn: "Boat Charter",
      shortTr: "Performans, dengeli ve keyifli kullanım sunan bir charter seçeneği.",
      shortEn: "Performance, balanced, and enjoyable charter option.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(59,130,246,0.10),transparent_24%)]" />
        <div className="absolute left-[-140px] top-[16%] h-[340px] w-[340px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-140px] top-[42%] h-[380px] w-[380px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:pb-20 md:pt-36">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
                {isTR
                  ? "ALBATROS SAILING • CHARTER"
                  : "ALBATROS SAILING • CHARTER"}
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl">
              {isTR ? "Tekneyi sadece kiralama," : "Do not only charter a boat,"}
              <span className="block text-cyan-300">
                {isTR ? "deneyimi seç." : "choose the experience."}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              {isTR
                ? "Charter filosu; konfor, güven ve gerçek deniz deneyimini aynı çizgide buluşturan teknelerden oluşur. Aşağıdaki teknelerden birini seçerek detay sayfasına geçebilir, özellikleri ve yapıyı inceleyebilirsin."
                : "The charter fleet consists of boats that bring together comfort, confidence, and real sea experience in one line. Choose one of the boats below to view its detail page and explore its features."}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <TopStrip
              title={isTR ? "SEÇİLMİŞ FİLO" : "CURATED FLEET"}
              text={
                isTR
                  ? "Her tekne yalnızca görsel değil; kullanım karakteri ve deneyim hissiyle değerlendirilir."
                  : "Each boat is evaluated not only visually, but also by handling character and experience quality."
              }
            />
            <TopStrip
              title={isTR ? "PREMIUM ÇİZGİ" : "PREMIUM LINE"}
              text={
                isTR
                  ? "Temiz sunum, net bilgi ve güçlü ilk izlenim ile daha üst segment charter hissi."
                  : "A higher-segment charter feel through clean presentation, clear information, and strong first impression."
              }
            />
            <TopStrip
              title={isTR ? "DETAYA GEÇİŞ" : "DETAIL ACCESS"}
              text={
                isTR
                  ? "Karttan detay sayfasına geçerek teknenin karakterini daha yakından inceleyebilirsin."
                  : "Move from card to detail page to examine the character of the boat more closely."
              }
            />
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/60">
              {isTR ? "Charter Filosu" : "Charter Fleet"}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {isTR ? "Müsait tekneleri keşfet" : "Explore available boats"}
            </h2>
          </div>

          <div className="text-sm text-slate-400">
            {isTR
              ? `${boats.length} tekne görüntüleniyor`
              : `${boats.length} boats displayed`}
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {boats.map((boat) => (
            <Link
              key={boat.slug}
              href={`/charter/${boat.slug}`}
              className="group block overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-md transition duration-300 hover:-translate-y-[6px] hover:border-cyan-300/20"
            >
              <div className="relative h-[260px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-[1400ms] group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url('${boat.image}')` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,16,0.06),rgba(3,8,16,0.18)_40%,rgba(3,8,16,0.72)_100%)]" />

                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-[rgba(8,17,31,0.58)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100/85 backdrop-blur-md">
                  {isTR ? boat.categoryTr : boat.categoryEn}
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    {boat.year} • {boat.cabins}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {boat.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm leading-7 text-slate-300">
                  {isTR ? boat.shortTr : boat.shortEn}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition group-hover:text-white">
                  {isTR ? "Detayı Aç" : "Open Detail"}
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function TopStrip({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur-md">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100/65">
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}