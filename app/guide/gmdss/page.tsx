import GlowPanel from "@/components/ui/GlowPanel";

const systems = [
  {
    title: "DSC Distress Alert",
    short: "Digital Selective Calling",
    why: "Acil durum çağrısını dijital olarak otomatik iletmek için kullanılır.",
    how: [
      "VHF DSC cihazında DISTRESS kapağı açılır.",
      "DISTRESS tuşuna 5 saniye basılı tutulur.",
      "MMSI bilgisi ve pozisyon otomatik gönderilir.",
      "Yakındaki gemiler ve kıyı istasyonları alarm alır.",
    ],
    importance:
      "Modern GMDSS sisteminin en kritik acil durum çağrı yöntemidir.",
  },

  {
    title: "MAYDAY",
    short: "Grave and Imminent Danger",
    why: "Can güvenliği tehlikede olduğunda kullanılır.",
    how: [
      "VHF CH16 açılır.",
      "MAYDAY üç kez söylenir.",
      "Gemi adı ve çağrı işareti belirtilir.",
      "Pozisyon verilir.",
      "Sorun açıklanır.",
      "İstenen yardım belirtilir.",
    ],
    importance:
      "Denizde en yüksek öncelikli sesli distress çağrısıdır.",
  },

  {
    title: "PAN-PAN",
    short: "Urgency Message",
    why: "Acil fakat hayati olmayan durumlarda kullanılır.",
    how: [
      "PAN-PAN üç kez söylenir.",
      "Gemi adı belirtilir.",
      "Durum açıklanır.",
      "Gerekirse yardım istenir.",
    ],
    importance:
      "Motor arızası, sürüklenme veya tıbbi durumlar için kullanılır.",
  },

  {
    title: "SECURITE",
    short: "Safety Broadcast",
    why: "Seyir emniyeti bilgilerini yayınlamak için kullanılır.",
    how: [
      "SECURITE üç kez söylenir.",
      "Yayın kanalı belirtilir.",
      "Navigasyon uyarısı aktarılır.",
    ],
    importance:
      "Sis, sürüklenen obje veya navigasyon tehlikeleri için önemlidir.",
  },

  {
    title: "EPIRB",
    short: "Emergency Position Indicating Radio Beacon",
    why: "Geminin battığı veya terk edildiği durumlarda konum göndermek için kullanılır.",
    how: [
      "Aktive edildiğinde COSPAS-SARSAT sistemine sinyal yollar.",
      "GPS pozisyonunu uyduya iletir.",
      "Arama kurtarma merkezleri alarm alır.",
    ],
    importance:
      "Arama kurtarma operasyonlarının temel sistemlerinden biridir.",
  },

  {
    title: "SART",
    short: "Search And Rescue Transponder",
    why: "Radar üzerinde hayatta kalma aracını görünür yapmak için kullanılır.",
    how: [
      "Can salında aktive edilir.",
      "X-band radar sinyallerine cevap verir.",
      "Radar ekranında seri nokta olarak görünür.",
    ],
    importance:
      "Kurtarma ekiplerinin can salını bulmasını kolaylaştırır.",
  },

  {
    title: "NAVTEX",
    short: "Navigational Telex",
    why: "Otomatik seyir ve meteoroloji uyarıları almak için kullanılır.",
    how: [
      "518 kHz üzerinden yayın alınır.",
      "Meteoroloji ve navigasyon mesajları otomatik gelir.",
      "Sistem sürekli dinlemededir.",
    ],
    importance:
      "Köprüüstü bilgi akışının önemli parçalarından biridir.",
  },
];

export default function GMDSSPage() {
  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-[36px] border border-cyan-300/10 bg-white/[0.03] p-7 backdrop-blur-xl">
          <p className="text-xs font-black tracking-[0.4em] text-cyan-300">
            GLOBAL MARITIME DISTRESS & SAFETY SYSTEM
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            GMDSS / Distress Communication
          </h1>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300 md:text-base">
            GMDSS sistemi; distress, urgency, safety ve arama kurtarma
            haberleşmesini standartlaştırmak için oluşturulmuştur.
            Modern köprüüstü operasyonlarının temel emniyet sistemlerinden biridir.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {systems.map((item) => (
            <GlowPanel
              key={item.title}
              className="rounded-[30px] border border-cyan-300/10 p-6"
            >
              <div className="mb-5">
                <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                  {item.short}
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {item.title}
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-black tracking-[0.25em] text-cyan-200">
                    NEDİR?
                  </p>

                  <p className="text-sm leading-7 text-slate-300">
                    {item.why}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-black tracking-[0.25em] text-cyan-200">
                    NASIL YAPILIR?
                  </p>

                  <div className="space-y-2">
                    {item.how.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/20 text-xs font-black text-cyan-100">
                          {index + 1}
                        </div>

                        <p className="flex-1 text-sm leading-6 text-slate-200">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-400/5 p-4">
                  <p className="mb-2 text-xs font-black tracking-[0.25em] text-cyan-200">
                    NİÇİN ÖNEMLİ?
                  </p>

                  <p className="text-sm leading-7 text-slate-300">
                    {item.importance}
                  </p>
                </div>
              </div>
            </GlowPanel>
          ))}
        </div>
      </div>
    </main>
  );
}