export type CharterBoatPrice = {
  id: string;
  month: string;
  price: string;
};

export type CharterBoatAvailability = {
  id: string;
  startDate: string;
  endDate: string;
  status: "AVAILABLE" | "BOOKED" | "OPTION" | "BLOCKED";
};

export type CharterBoat = {
  id: string;
  slug: string;
  name: string;
  model: string;
  year: number;
  cabins: number;
  guestsLabel: string;
  location: string;
  image: string;
  images?: string[];
  shortNote: string;
  description: string;
  features: string;
  prices: CharterBoatPrice[];
  availability?: CharterBoatAvailability[];
};

export const charterSeed: CharterBoat[] = [
  {
    id: "seed-bali-44",
    slug: "bali-44",
    name: "Bali 44",
    model: "Bali 44",
    year: 2024,
    cabins: 4,
    guestsLabel: "8-10 Kişi",
    location: "Bodrum",
    image: "/charter/bali-44.jpg",
    images: [
      "/charter/bali-44.jpg",
      "/charter/bali-44-1.jpg",
      "/charter/bali-44-2.jpg",
      "/charter/bali-44-3.jpg",
    ],
    shortNote:
      "Yeni nesil katamaran, geniş yaşam alanı ve premium tatil deneyimi.",
    description:
      "Filomuza yeni katılan Bali 44 ile konforlu ve geniş hacimli bir deniz tatili deneyimi yaşayabilirsiniz. Katamaran yapısı sayesinde stabil ve keyifli bir seyir sunar.",
    features:
      "4 kabin\nGeniş salon\nFlybridge\nJeneratör\nKlima\nModern mutfak\nGeniş güverte alanı",
    prices: [
      { id: "seed-bali-44-1", month: "Nisan", price: "8800 €" },
      { id: "seed-bali-44-2", month: "Mayıs", price: "9200 €" },
      { id: "seed-bali-44-3", month: "Haziran", price: "9900 €" },
      { id: "seed-bali-44-4", month: "Temmuz", price: "9900 €" },
      { id: "seed-bali-44-5", month: "Ağustos", price: "9900 €" },
      { id: "seed-bali-44-6", month: "Eylül", price: "9900 €" },
      { id: "seed-bali-44-7", month: "Ekim", price: "9200 €" },
      { id: "seed-bali-44-8", month: "Kasım", price: "8800 €" },
    ],
    availability: [
      {
        id: "seed-bali-44-w1",
        startDate: "2026-06-01",
        endDate: "2026-06-08",
        status: "AVAILABLE",
      },
      {
        id: "seed-bali-44-w2",
        startDate: "2026-06-08",
        endDate: "2026-06-15",
        status: "BOOKED",
      },
      {
        id: "seed-bali-44-w3",
        startDate: "2026-06-15",
        endDate: "2026-06-22",
        status: "AVAILABLE",
      },
      {
        id: "seed-bali-44-w4",
        startDate: "2026-07-06",
        endDate: "2026-07-13",
        status: "OPTION",
      },
    ],
  },
  {
    id: "seed-bavaria-46-firststep",
    slug: "bavaria-46-firststep",
    name: "Bavaria 46 FirstStep",
    model: "Bavaria 46",
    year: 2022,
    cabins: 4,
    guestsLabel: "8 Kişi",
    location: "Bodrum",
    image: "/charter/bavaria-46-firststep.jpg",
    images: [
      "/charter/bavaria-46-firststep.jpg",
      "/charter/bavaria-46-firststep-1.jpg",
      "/charter/bavaria-46-firststep-2.jpg",
      "/charter/bavaria-46-firststep-3.jpg",
    ],
    shortNote: "Yeni nesil Bavaria 46, konfor ve performans dengesi.",
    description:
      "Bavaria 46 FirstStep, hem performans hem konfor sunan modern bir yelkenli teknedir. Aileler ve arkadaş grupları için ideal charter seçeneğidir.",
    features:
      "4 kabin\n3 WC\nGeniş kokpit\nModern navigasyon sistemleri\nKonforlu yaşam alanı",
    prices: [
      { id: "seed-firststep-1", month: "Nisan", price: "4100 €" },
      { id: "seed-firststep-2", month: "Mayıs", price: "4300 €" },
      { id: "seed-firststep-3", month: "Haziran", price: "4500 €" },
      { id: "seed-firststep-4", month: "Temmuz", price: "4900 €" },
      { id: "seed-firststep-5", month: "Ağustos", price: "4900 €" },
      { id: "seed-firststep-6", month: "Eylül", price: "4900 €" },
      { id: "seed-firststep-7", month: "Ekim", price: "4500 €" },
      { id: "seed-firststep-8", month: "Kasım", price: "4100 €" },
    ],
    availability: [
      {
        id: "seed-firststep-w1",
        startDate: "2026-05-10",
        endDate: "2026-05-17",
        status: "AVAILABLE",
      },
      {
        id: "seed-firststep-w2",
        startDate: "2026-06-14",
        endDate: "2026-06-21",
        status: "OPTION",
      },
      {
        id: "seed-firststep-w3",
        startDate: "2026-07-19",
        endDate: "2026-07-26",
        status: "BOOKED",
      },
    ],
  },
  {
    id: "seed-bavaria-46-dragutl",
    slug: "bavaria-46-dragutl",
    name: "Bavaria 46 DragutL",
    model: "Bavaria 46",
    year: 2024,
    cabins: 4,
    guestsLabel: "8 Kişi",
    location: "Bodrum",
    image: "/charter/bavaria-46-dragutl.jpg",
    images: [
      "/charter/bavaria-46-dragutl.jpg",
      "/charter/bavaria-46-dragutl-1.jpg",
      "/charter/bavaria-46-dragutl-2.jpg",
      "/charter/bavaria-46-dragutl-3.jpg",
    ],
    shortNote:
      "Yeni model, indirimli sezon fırsatları ile güçlü charter teknesi.",
    description:
      "Bavaria 46 DragutL, modern donanımı ve geniş yaşam alanı ile üst segment bir charter deneyimi sunar. Yeni model olması sebebiyle maksimum konfor sağlar.",
    features:
      "4 kabin\n3 WC\nGüneş paneli\nİnverter\nModern mutfak\nGeniş yaşam alanı",
    prices: [
      { id: "seed-dragutl-1", month: "Nisan", price: "3700 €" },
      { id: "seed-dragutl-2", month: "Mayıs", price: "4300 €" },
      { id: "seed-dragutl-3", month: "Haziran", price: "4600 €" },
      { id: "seed-dragutl-4", month: "Temmuz", price: "4900 €" },
      { id: "seed-dragutl-5", month: "Ağustos", price: "4900 €" },
      { id: "seed-dragutl-6", month: "Eylül", price: "4600 €" },
      { id: "seed-dragutl-7", month: "Ekim", price: "4500 €" },
      { id: "seed-dragutl-8", month: "Kasım", price: "3700 €" },
    ],
    availability: [
      {
        id: "seed-dragutl-w1",
        startDate: "2026-05-03",
        endDate: "2026-05-10",
        status: "AVAILABLE",
      },
      {
        id: "seed-dragutl-w2",
        startDate: "2026-06-21",
        endDate: "2026-06-28",
        status: "AVAILABLE",
      },
      {
        id: "seed-dragutl-w3",
        startDate: "2026-08-02",
        endDate: "2026-08-09",
        status: "BOOKED",
      },
    ],
  },
  {
    id: "seed-beneteau-oceanis-41-draguts",
    slug: "beneteau-oceanis-41-draguts",
    name: "Beneteau Oceanis 41 DragutS",
    model: "Beneteau Oceanis 41",
    year: 2016,
    cabins: 3,
    guestsLabel: "6-8 Kişi",
    location: "Bodrum",
    image: "/charter/oceanis-41-draguts.jpg",
    images: [
      "/charter/oceanis-41-draguts.jpg",
      "/charter/oceanis-41-draguts-1.jpg",
      "/charter/oceanis-41-draguts-2.jpg",
      "/charter/oceanis-41-draguts-3.jpg",
    ],
    shortNote:
      "Ekonomik ve dengeli, eğitim sonrası charter için ideal tekne.",
    description:
      "Beneteau Oceanis 41 DragutS, kullanım kolaylığı ve dengeli yapısıyla hem yeni başlayanlar hem de deneyimli denizciler için ideal bir charter seçeneğidir.",
    features:
      "3 kabin\n2 WC\nKonforlu iç hacim\nKolay manevra\nEkonomik kullanım",
    prices: [
      { id: "seed-draguts-1", month: "Nisan", price: "2600 €" },
      { id: "seed-draguts-2", month: "Mayıs", price: "2800 €" },
      { id: "seed-draguts-3", month: "Haziran", price: "3200 €" },
      { id: "seed-draguts-4", month: "Temmuz", price: "3400 €" },
      { id: "seed-draguts-5", month: "Ağustos", price: "3400 €" },
      { id: "seed-draguts-6", month: "Eylül", price: "3400 €" },
      { id: "seed-draguts-7", month: "Ekim", price: "3200 €" },
      { id: "seed-draguts-8", month: "Kasım", price: "2900 €" },
    ],
    availability: [
      {
        id: "seed-draguts-w1",
        startDate: "2026-05-17",
        endDate: "2026-05-24",
        status: "AVAILABLE",
      },
      {
        id: "seed-draguts-w2",
        startDate: "2026-06-28",
        endDate: "2026-07-05",
        status: "OPTION",
      },
      {
        id: "seed-draguts-w3",
        startDate: "2026-07-12",
        endDate: "2026-07-19",
        status: "AVAILABLE",
      },
    ],
  },
];