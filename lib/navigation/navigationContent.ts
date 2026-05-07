export const navigationHero = {
  eyebrow: "Albatros Sailing Academy",
  title: "Navigation Academy Pro",
  subtitle:
    "Harita okuma, rota çizimi, mevki bulma, DR, EP, Fix, Running Fix, tidal stream, risk analizi ve profesyonel passage planning için premium eğitim modülü.",
  message:
    "Elektronik cihazlar yardımcıdır; gerçek navigator haritayı, pusulayı, zamanı, mesafeyi ve denizi birlikte okuyabilen kişidir.",
  stats: [
    { value: "7", label: "Ana Modül" },
    { value: "25+", label: "Eğitim Konusu" },
    { value: "40+", label: "Uygulama Örneği" },
    { value: "100%", label: "Seyir Emniyeti Odaklı" },
  ],
};

export const chartDefinition = {
  title: "Harita Nedir?",
  text:
    "Deniz haritası; kıyıları, derinlikleri, tehlikeleri, fenerleri, şamandıraları, rotaları ve seyir emniyeti için gerekli bilgileri gösteren resmi navigasyon aracıdır. Elektronik sistemler bozulsa bile kâğıt harita, pusula ve temel hesap bilgisiyle seyir devam ettirilebilir.",
};

export const chartInformation = [
  "Derinlikler",
  "Sığlıklar",
  "Kayalıklar",
  "Batıklar",
  "Fenerler",
  "Şamandıralar",
  "Trafik ayrım düzenleri",
  "Demir yerleri",
  "Yasak sahalar",
  "Kablolar",
  "Boru hatları",
  "Liman girişleri",
  "Koordinatlar",
  "Ölçek",
  "Pusula gülü",
  "Notlar ve uyarılar",
];

export const chartTools = [
  "Paralel cetvel",
  "Plotter",
  "Pergel",
  "Dividers",
  "Kurşun kalem",
  "Silgi",
  "Pusula",
  "El kerteriz pusulası",
  "Dürbün",
  "Almanak",
  "Tide table",
  "Pilot book",
  "Logbook",
  "GPS",
  "ECDIS",
  "Chartplotter",
];

export const navigationLevels = [
  {
    level: "01",
    title: "Başlangıç Seviyesi",
    badge: "Chart Basics",
    description:
      "Haritayı tanıma, sembolleri okuma, derinlikleri anlama, kuzey yönünü bulma, koordinat okuma ve basit mesafe ölçme.",
    topics: [
      "Harita ölçeği",
      "Koordinat okuma",
      "Derinlik ve semboller",
      "Pusula gülü",
    ],
  },
  {
    level: "02",
    title: "Orta Seviye",
    badge: "Route Work",
    description:
      "Rota çizme, waypoint koyma, bearing alma, Fix, DR, EP ve hız-zaman-mesafe hesabı.",
    topics: [
      "Waypoint seçimi",
      "Course line",
      "Bearing",
      "Speed / Time / Distance",
    ],
  },
  {
    level: "03",
    title: "İleri Seviye",
    badge: "Advanced Pilotage",
    description:
      "Tidal stream, CTS, leeway, variation/deviation, running fix, safety depth ve under keel clearance.",
    topics: [
      "CTS hesabı",
      "Leeway",
      "Running Fix",
      "Under Keel Clearance",
    ],
  },
  {
    level: "04",
    title: "Profesyonel Seviye",
    badge: "OOW Logic",
    description:
      "Passage planning, risk analizi, alternatif rota, elektronik arıza senaryosu, radar/AIS/ECDIS ile kâğıt harita cross-check ve OOW karar mantığı.",
    topics: [
      "Passage planning",
      "Risk analysis",
      "AIS/Radar cross-check",
      "Emergency navigation",
    ],
  },
];

export const navigationTerms = [
  {
    title: "DR — Dead Reckoning",
    shortTitle: "DR",
    subtitle: "Dead Reckoning",
    description:
      "Son bilinen mevkiden itibaren rota, hız ve zaman kullanılarak tahmini mevki üretme yöntemidir.",
    proNote:
      "DR, özellikle elektronik sistem arızalarında seyri sürdürmek için temel yöntemdir.",
  },
  {
    title: "EP — Estimated Position",
    shortTitle: "EP",
    subtitle: "Estimated Position",
    description:
      "DR üzerine rüzgâr, akıntı, leeway ve hata payları eklenerek hesaplanan daha gerçekçi tahmini mevkidir.",
    proNote:
      "EP kesin mevki değildir; güvenli bölgelerde dahi Fix ile doğrulanmalıdır.",
  },
  {
    title: "Fix",
    shortTitle: "FIX",
    subtitle: "Observed Position",
    description:
      "İki veya daha fazla kerteriz, mesafe, radar hattı ya da görsel referansla belirlenen gerçek mevkidir.",
    proNote:
      "İyi bir Fix, uygun açı kesişimi ve güvenilir referanslarla alınır.",
  },
  {
    title: "Running Fix",
    shortTitle: "RFIX",
    subtitle: "Advanced Positioning",
    description:
      "Farklı zamanlarda alınan kerterizlerin tekne hareketi hesaba katılarak taşınmasıyla bulunan mevkidir.",
    proNote:
      "Tek referansın bulunduğu kıyı seyirlerinde profesyonel bir mevki bulma yöntemidir.",
  },
];

export const routePlanningSteps = [
  {
    step: "01",
    title: "Departure Point",
    description:
      "Seyrin başlayacağı nokta belirlenir. Liman çıkışı, sığlıklar, trafik ve manevra alanı kontrol edilir.",
  },
  {
    step: "02",
    title: "Waypoint Selection",
    description:
      "Rota üzerindeki dönüş noktaları seçilir. Her waypoint güvenli su, mesafe, görüş ve trafik açısından değerlendirilir.",
  },
  {
    step: "03",
    title: "Course Line",
    description:
      "Harita üzerinde rota hattı çizilir. Hakiki rota, manyetik rota, variation ve deviation hesabı dikkate alınır.",
  },
  {
    step: "04",
    title: "Distance & Time",
    description:
      "Her bacak için mesafe ölçülür. Tekne hızıyla ETA, seyir süresi ve yakıt/enerji planlaması yapılır.",
  },
  {
    step: "05",
    title: "Danger Check",
    description:
      "Sığlık, kaya, batık, trafik ayrım düzeni, yasak saha, kablo ve boru hatları kontrol edilir.",
  },
  {
    step: "06",
    title: "Backup Plan",
    description:
      "Alternatif limanlar, güvenli demir yerleri ve elektronik arıza durumunda kâğıt harita ile devam planı hazırlanır.",
  },
];

export const positionMethods = [
  {
    title: "DR",
    subtitle: "Dead Reckoning",
    description:
      "Son bilinen mevkiden itibaren rota, hız ve zaman kullanılarak tahmini mevki üretir.",
    warning:
      "Akıntı, rüzgâr ve dümen hatası hesaba katılmazsa zamanla gerçek mevkiden uzaklaşabilir.",
  },
  {
    title: "EP",
    subtitle: "Estimated Position",
    description:
      "DR üzerine akıntı, rüzgâr, leeway ve hata payları eklenerek daha gerçekçi tahmini mevki oluşturur.",
    warning:
      "EP kesin mevki değildir; navigator bunu riskli bölgelerde Fix ile doğrulamalıdır.",
  },
  {
    title: "FIX",
    subtitle: "Observed Position",
    description:
      "İki veya daha fazla kerteriz, radar mesafesi, görsel referans veya GPS karşılaştırmasıyla belirlenen gerçek mevkidir.",
    warning:
      "Fix güvenilirliği kullanılan referansların doğruluğuna ve açı kesişim kalitesine bağlıdır.",
  },
];

export const electronicFailureScenario = {
  title: "Elektronik Arıza Senaryosu",
  description:
    "GPS, chartplotter veya ECDIS arızalandığında seyir durmaz. Profesyonel navigator son bilinen mevkiyi işaretler, saati yazar, pusula rotasını korur, hız-zaman-mesafe hesabıyla DR üretir ve çevredeki fener, kara şekli, derinlik ve radar/görsel referanslarla mevkisini doğrular.",
  actions: [
    "Son bilinen mevkiyi haritada işaretle.",
    "Saat, rota ve hızı logbook’a yaz.",
    "Pusula rotasını kontrol et.",
    "DR hattı oluştur.",
    "Derinlikleri haritayla karşılaştır.",
    "Görsel kerteriz veya radar referansı al.",
    "Güvenli suya çık veya alternatif rota seç.",
  ],
};

export const professionalChecklist = [
  "Harita güncelliği kontrol edildi mi?",
  "Rota üzerinde sığlık, kaya ve batık var mı?",
  "Safety depth ve under keel clearance hesaplandı mı?",
  "Tidal stream ve leeway hesaba katıldı mı?",
  "Alternatif liman veya demir yeri belirlendi mi?",
  "Elektronik arıza durumunda kâğıt harita planı hazır mı?",
  "AIS/Radar bilgisi kâğıt harita ile karşılaştırıldı mı?",
  "Logbook düzenli tutuluyor mu?",
];

export const riskCards = [
  {
    title: "Sığ Su Riski",
    description:
      "Derinlik, draft, gelgit ve emniyet payı birlikte değerlendirilmelidir.",
  },
  {
    title: "Trafik Riski",
    description:
      "TSS, liman girişleri, feribot hatları ve yoğun geçiş bölgeleri önceden analiz edilmelidir.",
  },
  {
    title: "Elektronik Bağımlılık",
    description:
      "GPS pozisyonu tek başına yeterli değildir. Harita, pusula, zaman ve deniz gözlemiyle doğrulanmalıdır.",
  },
  {
    title: "Hava ve Akıntı",
    description:
      "Rüzgâr, akıntı ve dalga rotayı etkiler. Profesyonel seyirde rota sadece çizilmez, sürekli yönetilir.",
  },
];

export const professionalNavigator = {
  title: "Profesyonel Navigator Mantığı",
  text:
    "Profesyonel seviyede amaç sadece rota çizmek değildir. Amaç; hava, akıntı, trafik, tekne performansı, emniyet derinliği, alternatif limanlar, elektronik arıza ihtimali ve insan hatasını birlikte değerlendirerek güvenli seyir kararı verebilmektir.",
};

export const finalCta = {
  title: "Navigation Academy Pro",
  text:
    "Bu modül; harita okuma bilgisini simülasyon, uygulama, quiz ve gerçek seyir karar mantığına dönüştürmek için tasarlanmıştır.",
  primaryLabel: "Simülatöre Git",
  primaryHref: "/simulator",
  secondaryLabel: "Akademiye Dön",
  secondaryHref: "/guide",
};
export const navigationFormulas = [
  {
    title: "Hız – Zaman – Mesafe",
    formula: "Mesafe = Hız × Zaman",
    example: "6 knot hızla 2 saatte 12 deniz mili yol yapılır.",
    note: "Denizde hız knot, mesafe deniz mili, zaman saat olarak düşünülür.",
  },
  {
    title: "Zaman Hesabı",
    formula: "Zaman = Mesafe ÷ Hız",
    example: "18 deniz mili / 6 knot = 3 saat.",
    note: "ETA hesaplarında en temel formüldür.",
  },
  {
    title: "Hız Hesabı",
    formula: "Hız = Mesafe ÷ Zaman",
    example: "12 deniz mili / 2 saat = 6 knot.",
    note: "Gerçek hız, akıntı ve rüzgâr etkisiyle değişebilir.",
  },
  {
    title: "DR — Dead Reckoning",
    formula: "Yeni Mevki = Son Mevki + Rota × Hız × Zaman",
    example:
      "Son bilinen mevkiden 090° rotada 6 knot hızla 1 saat gidilirse DR mevkisi 6 NM doğuya taşınır.",
    note: "DR; akıntı, rüzgâr ve leeway hesaba katılmadan yapılan tahmini mevkidir.",
  },
  {
    title: "EP — Estimated Position",
    formula: "EP = DR + Akıntı + Rüzgâr + Leeway Düzeltmesi",
    example:
      "DR hattı üzerine akıntı set/drift etkisi eklenerek daha gerçekçi tahmini mevki bulunur.",
    note: "EP kesin mevki değildir; Fix ile doğrulanmalıdır.",
  },
  {
    title: "True Course → Magnetic Course",
    formula: "Magnetic Course = True Course ± Variation",
    example:
      "True Course 090°, variation 5°W ise Magnetic Course yaklaşık 095° olur.",
    note: "Batı variation genellikle eklenir, doğu variation genellikle çıkarılır: West is best, East is least.",
  },
  {
    title: "Magnetic Course → Compass Course",
    formula: "Compass Course = Magnetic Course ± Deviation",
    example:
      "Magnetic Course 095°, deviation 2°E ise Compass Course yaklaşık 093° olur.",
    note: "Deviation teknenin pusula sapmasıdır ve tekneye özeldir.",
  },
  {
    title: "Under Keel Clearance",
    formula: "UKC = Mevcut Derinlik + Gelgit Yüksekliği - Tekne Draftı",
    example:
      "Derinlik 4 m, tide 0.8 m, draft 2 m ise UKC = 2.8 m.",
    note: "Emniyet payı ayrıca eklenmelidir.",
  },
  {
    title: "Safety Depth",
    formula: "Safety Depth = Draft + Minimum Emniyet Payı",
    example:
      "Draft 2 m, emniyet payı 1 m ise safety depth 3 m seçilebilir.",
    note: "Dalga, squat, dip yapısı ve seyir bölgesi dikkate alınmalıdır.",
  },
  {
    title: "Set & Drift",
    formula: "Akıntı Etkisi = Set yönü + Drift hızı × Zaman",
    example:
      "1 knot akıntı 2 saat boyunca etkiliyse tekneyi yaklaşık 2 NM sürükler.",
    note: "Set akıntının yönü, drift akıntının hızıdır.",
  },
  {
    title: "Leeway",
    formula: "Düzeltilmiş Rota = Planlanan Rota ± Leeway Açısı",
    example:
      "Planlanan rota 090°, rüzgâr tekneyi 5° düşürüyorsa rota buna göre düzeltilir.",
    note: "Leeway özellikle yelkenli teknelerde çok önemlidir.",
  },
  {
    title: "ETA",
    formula: "ETA = Başlangıç Saati + Seyir Süresi",
    example:
      "Saat 10:00’da çıkış, seyir süresi 3 saat ise ETA 13:00 olur.",
    note: "ETA; hava, akıntı, trafik ve manevralarla sürekli güncellenmelidir.",
  },
];