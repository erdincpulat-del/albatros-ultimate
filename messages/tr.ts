import type { MessageSchema } from "./types";

export const tr: MessageSchema & {
  registry: {
    title: string;
    description: string;
    placeholder: string;
    search: string;
    searching: string;
    notFound: string;
    inputError: string;
    searchError: string;
    fullName: string;
    certificateId: string;
    qualification: string;
    seaMiles: string;
    status: string;
    verify: string;
  };
  windEngine: {
    hero: {
      title: string;
      subtitle: string;
    };
    compass: {
      title: string;
      desc: string;
    };
    sea: {
      title: string;
      desc: string;
    };
    decision: {
      title: string;
      desc: string;
    };
    lessons: {
      title: string;
      items: string[];
    };
    scenario: {
      title: string;
      desc: string;
    };
    case: {
      see: string;
      meaning: string;
      mistake: string;
      response: string;
      insight: string;
    };
    quiz: {
      title: string;
      desc: string;
    };
    summary: {
      text: string;
    };
  };
} = {
  nav: {
    home: "Ana Sayfa",
    training: "Eğitim",
    programs: "Programlar",
    charter: "Tekne Kiralama",
    registry: "Kayıt",
    verify: "Doğrula",
    contact: "İletişim",
    admin: "Admin",
    adminLogin: "Admin Girişi",
    reserve: "Rezervasyon",
    menu: "Menü",
  },

  footer: {
    description:
      "Profesyonel yelken eğitimi, sertifikalandırma ve kayıt doğrulama platformu.",
    navigationTitle: "Navigasyon",
    certificationTitle: "Sertifikasyon",
    contactTitle: "İletişim",
    rights: "Tüm hakları saklıdır",
  },

  heroBadge: "Albatros Sailing · Resmi Eğitim Platformu",
  heroTitle:
    "Gerçek Yetkinlik ve Güven Arayanlar İçin Premium Yelken Eğitimi.",
  heroDescription:
    "Gerçek rotalarda eğitim alın, pratik denizcilik becerilerinizi geliştirin, doğrulanabilir sertifika kazanın ve denizde güven, disiplin ve otorite ile ilerleyin.",
  heroPrimaryButton: "Eğitime Başla",
  heroSecondaryButton: "Programları İncele",
  heroTags: [
    "Açık Deniz Eğitimi",
    "Profesyonel Gelişim",
    "Güvenli Doğrulama Sistemi",
  ],

  stats: [
    {
      label: "Gerçek Deniz Eğitimi",
      value: "Açık denizde, gerçek offshore rotalarında pratik eğitim.",
    },
    {
      label: "Doğrulanabilir Sertifika",
      value: "Kayıt destekli, güvenli sertifika doğrulama altyapısı.",
    },
    {
      label: "Kart Ön / Arka",
      value: "Fiziksel lisans görünümü ile dijital doğrulama bir arada.",
    },
    {
      label: "Profesyonel Yol",
      value: "Başlangıçtan ileri seviyeye uzanan yapılandırılmış gelişim.",
    },
  ],

  verificationAdvantageTitle: "Doğrulama Avantajı",
  verificationAdvantageDescription:
    "Gerçek bir eğitim sisteminin temelinde kanıt, yapı ve güven yer alır. Albatros Sailing; pratik eğitimi, premium sertifika ve doğrulama deneyimi ile birleştirir.",

  trustBar: [
    {
      title: "Gelişim İçin Kuruldu",
      description:
        "İlk komuta kararlarından ileri seviye açık deniz güvenine kadar yapılandırılmış ilerleme.",
    },
    {
      title: "Güven İçin Kuruldu",
      description:
        "Kayıt destekli belgeler ve anlık doğrulama mantığıyla kurumsal güven.",
    },
    {
      title: "Ciddi Katılımcılar İçin",
      description:
        "Sıradan bir kurs deneyimi değil, premium bir denizcilik gelişim yolu.",
    },
  ],

  featuresSectionBadge: "Platformun Temel Güçleri",
  featuresSectionTitle:
    "Eğiten, sertifikalandıran ve doğrulayan güçlü bir yelken platformu.",
  featuresSectionDescription:
    "Bu yapı; gerçek eğitim sunumu, sertifika üretimi ve daha güçlü bir kurumsal güven algısı oluşturmak için tasarlanmıştır.",

  features: [
    {
      title: "Profesyonel Yelken Eğitimi",
      description:
        "Başlangıç seviyesinden açık denizde güvenle komuta edebilen seviyeye kadar yapılandırılmış eğitim programları.",
      href: "/training",
    },
    {
      title: "Resmi Kayıt Sistemi",
      description:
        "Albatros Sailing doğrulama altyapısı üzerinden resmi sertifika kayıtlarını arayın ve inceleyin.",
      href: "/registry",
    },
    {
      title: "Sertifika Doğrulama",
      description:
        "Aktif sertifikaları güvenli doğrulama portalı üzerinden anında kontrol edin.",
      href: "/verify",
    },
  ],

  learnLabel: "İncele",
  learnMore: "Daha Fazla",

  programsSectionBadge: "Eğitim Programları",
  programsSectionTitle: "Hedefinize en uygun rotayı seçin.",
  programsSectionDescription:
    "Her program sizi daha fazla güvene, daha fazla komutaya ve denizde daha yüksek itibara taşımak için tasarlanmıştır.",
  viewAllPrograms: "Tüm Programları Gör",
  programCardBadge: "Program",
  viewDetails: "Detayları Gör",

  programs: [
    {
      title: "Basic Sailing",
      description:
        "Yelkene, güvenliğe, tekne kullanımına ve temel denizciliğe güçlü bir giriş.",
      href: "/programs/basic-sailing",
    },
    {
      title: "Coastal Skipper",
      description:
        "Navigasyon, komuta becerileri, marina manevraları ve kıyı seyir planlaması.",
      href: "/programs/coastal-skipper",
    },
    {
      title: "Offshore Yacht Course",
      description:
        "Hava sistemleri, gece seyri, açık deniz rutinleri ve dayanıklılık odaklı ileri seviye eğitim.",
      href: "/programs/offshore-yacht-course",
    },
    {
      title: "Yachtmaster Track",
      description:
        "Komuta ve otorite hedefleyen adaylar için premium, sertifika odaklı gelişim yolu.",
      href: "/programs/yachtmaster",
    },
  ],

  verifySectionBadge: "Resmi Sertifika Doğrulama",
  verifySectionTitle: "Güven, anında doğrulanabildiğinde daha güçlü olur.",
  verifySectionDescription:
    "Resmi kaydı arayın, sertifika geçerliliğini kontrol edin ve profesyonel dijital doğrulama akışıyla kurumsal güveni güçlendirin.",
  verifyButton: "Sertifika Doğrula",
  registryButton: "Kaydı Aç",

  whyItMattersTitle: "Neden Önemli",
  whyItMattersItems: [
    {
      title: "Kurumsal Güven",
      description:
        "Görünür bir doğrulama sistemi, tüm eğitim yapısının kalite ve ciddiyet algısını yükseltir.",
    },
    {
      title: "Öğrenci Güveni",
      description:
        "Gerçek bir kayıt ve sertifika mantığı, katılımcının başarısına olan bağlılığını güçlendirir.",
    },
    {
      title: "Premium Konumlandırma",
      description:
        "Doğrulama yalnızca işlev değildir; sıradan kurs sayfalarından ayrışmanızı sağlayan güçlü bir marka sinyalidir.",
    },
  ],

  ctaTitle: "Deniz deneyimine hazır mısınız?",
  ctaDescription:
    "Albatros Sailing ile eğitim alın veya premium charter deneyimini keşfedin.",

  homeWhy: {
    badge: "NEDEN ALBATROS",
    title:
      "İnsanlar sadece kurs değil, güvenilir bir denizcilik markası arıyor.",
    description:
      "Albatros Sailing; eğitim, uygulama, rota deneyimi ve doğrulanabilir sertifika sistemini tek bir premium yapıda birleştirir.",
    items: [
      {
        title: "Gerçek deniz pratiği",
        description: "Sadece teorik değil, gerçek rota ve ekip disiplini.",
      },
      {
        title: "Premium deneyim",
        description: "Eğitimden sunuma kadar üst segment kalite hissi.",
      },
      {
        title: "Uluslararası vizyon",
        description: "Açık deniz ve global rota yaklaşımı.",
      },
      {
        title: "Doğrulanabilir sistem",
        description: "QR + online verification altyapısı.",
      },
    ],
  },

  trainingModules: {
    badge: "TRAINING PATH",
    title: "Denizcilik eğitimini modüler değil, bütüncül ele alıyoruz.",
    description:
      "Amaç yalnızca yelken öğretmek değil; karar verme, güvenlik, rota yönetimi ve profesyonel denizcilik refleksi kazandırmaktır.",
    items: [
      {
        title: "Sextant & Navigation",
        description:
          "Modern seyir araçlarını anlayan, klasik seyir mantığını bilen kaptan yaklaşımı.",
        href: "/guide/sextant-nedir",
      },
      {
        title: "COLREG",
        description:
          "Karşılaşma kuralları, trafik mantığı ve denizde doğru karar verme disiplini.",
        href: "/guide/colreg",
      },
      {
        title: "AIS / VTS",
        description:
          "Yoğun trafik, TSS ve profesyonel deniz trafiği içinde farkındalık geliştiren modül.",
        href: "/guide/ais-ve-vts-nedir",
      },
      {
        title: "Rota Planlama",
        description:
          "Hava, zamanlama, alternatifler ve güvenlik kararlarıyla gerçek rota kurma mantığı.",
        href: "/guide/rota-planlama",
      },
    ],
  },

  instructorAuthority: {
    badge: "INSTRUCTOR AUTHORITY",
    title: "Eğitimde otorite, denizde güven.",
    description:
      "Sadece bilgi değil; karar alabilen, ekip yöneten ve gerçek denizci refleksi kazanan kaptanlar yetiştiriyoruz.",
    items: [
      "Offshore training",
      "Real navigation",
      "Crew management",
      "Professional discipline",
    ],
  },

  certificateCta: {
    title: "Sertifikanızı doğrulayın.",
    description:
      "Albatros sertifikaları online olarak doğrulanabilir. Bu yapı güveni görünür hale getirir ve markayı kurumsal olarak güçlendirir.",
    button: "Doğrula",
  },

  alumniSection: {
    title: "Albatros mezunları",
    items: [
      "“Hayatım değişti.”",
      "“Gerçek kaptanlık burada başlıyor.”",
      "“Sadece kurs değil, deneyim.”",
    ],
  },

  charterIntro: {
    badge: "CHARTER EXPERIENCE",
    title:
      "Charter, ana kimliğimizi destekleyen premium deneyim katmanıdır.",
    description:
      "Albatros Sailing charter tarafı; eğitimin yanında markanın seçkin rota ve deniz deneyimi tarafını temsil eder.",
  },

  homeFinalCta: {
    badge: "NEXT STEP",
    title: "Sizin için en doğru eğitim yolunu birlikte planlayalım.",
    description:
      "Başlangıç seviyesinden offshore disiplinine kadar, hedefinize uygun program yapısını birlikte belirleyelim.",
    primary: "Programları İncele",
    secondary: "Bizimle İletişime Geç",
  },

  windEngine: {
    hero: {
      title: "Rüzgârı Okumak Bir Bilgi Değil, Bir Disiplindir",
      subtitle:
        "Rüzgâr yönü, şiddeti ve deniz yüzeyine etkisi; yalnızca veri değil, kararın kendisidir. Bu modül rüzgârı yorumlamayı değil, yönetmeyi öğretir.",
    },

    compass: {
      title: "Rüzgâr Yönü: Okumak Değil, Konumlandırmak",
      desc:
        "Rüzgâr yönü, tekne üzerindeki yük dağılımını ve yaklaşma hattını belirler. 16 yönlü okuma, hassas konum farkındalığı sağlar.",
    },

    sea: {
      title: "Deniz Yüzeyi: Rüzgârın Gerçek Karşılığı",
      desc:
        "Deniz yüzeyi rüzgârın gerçek etkisini yansıtır. Dalga formu ve köpük, sayısal veriden daha güvenilir olabilir.",
    },

    decision: {
      title: "Karar Noktası: Eğitim mi, Operasyon mu?",
      desc:
        "Aynı rüzgâr farklı bağlamlarda farklı anlam taşır. Deneyim, sınırı doğru belirlemektir.",
    },

    lessons: {
      title: "Temel Prensipler",
      items: [
        "Rüzgâr torbası yönü gösterir, karar verdirmez.",
        "Beaufort açıklama sunar, yorum gerektirir.",
        "Deniz yüzeyi rüzgârı doğrular.",
        "Gerçek denizcilik bu verilerin birlikte okunmasıdır.",
      ],
    },

    scenario: {
      title: "Uygulamalı Senaryo Analizi",
      desc:
        "Bilgi tek başına yeterli değildir. Değer, doğru anda doğru kararı verebilmektir.",
    },

    case: {
      see: "Sahada Gözlenen",
      meaning: "Operasyonel Anlamı",
      mistake: "Sık Yapılan Hata",
      response: "Doğru Yaklaşım",
      insight: "Eğitmen Yorumu",
    },

    quiz: {
      title: "Bilgiyi Test Et Değil, Kararı Sorgula",
      desc:
        "Amaç doğru cevabı bulmak değil, doğru düşünmeyi kurmaktır.",
    },

    summary: {
      text:
        "Rüzgâr ezberlenmez. Okunur, yorumlanır ve doğru karara dönüştürülür. Albatros yaklaşımı, bilgi değil karar üretir.",
    },
  },

  registry: {
    title: "Global Sertifika Kayıt Sistemi",
    description:
      "Sertifika ID girerek Albatros Sailing dijital sertifika kaydını ara ve doğrula.",
    placeholder: "Örnek: AS-OFF-2026-1735",
    search: "Sertifika Ara",
    searching: "Aranıyor...",
    notFound: "Bu certificate ID için kayıt bulunamadı.",
    inputError: "Lütfen Certificate ID gir.",
    searchError: "Arama sırasında hata oluştu.",
    fullName: "Ad Soyad",
    certificateId: "Sertifika ID",
    qualification: "Yeterlilik",
    seaMiles: "Deniz Mili",
    status: "Durum",
    verify: "Tam Doğrulama Sayfasını Aç",
  },
};