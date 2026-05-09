export type CharterBoatPrice = {
  id: string;
  month: string;
  price: string;
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
  shortNote: string;
  description: string;
  features: string;
  prices: CharterBoatPrice[];
};

export const charterSeed: CharterBoat[] = [
  {
    id: "seed-bali-44",
    slug: "bali-44",
    name: "Bali 44",
    model: "Bali 44",
    year: 2024,
    cabins: 4,
    guestsLabel: "8-10 Kisi",
    location: "Bodrum",
    image: "/charter/bali-44.jpg",
    shortNote:
      "Yeni nesil katamaran, genis yasam alani ve premium tatil deneyimi.",
    description:
      "Filomuza yeni katilan Bali 44 ile konforlu ve genis hacimli bir deniz tatili deneyimi yasayabilirsiniz. Katamaran yapisi sayesinde stabil ve keyifli bir seyir sunar.",
    features:
      "4 kabin\nGenis salon\nFlybridge\nJenerator\nKlima\nModern mutfak\nGenis guverte alani",
    prices: [
      { id: "seed-bali-44-1", month: "Nisan", price: "8800 €" },
      { id: "seed-bali-44-2", month: "Mayis", price: "9200 €" },
      { id: "seed-bali-44-3", month: "Haziran", price: "9900 €" },
      { id: "seed-bali-44-4", month: "Temmuz", price: "9900 €" },
      { id: "seed-bali-44-5", month: "Agustos", price: "9900 €" },
      { id: "seed-bali-44-6", month: "Eylul", price: "9900 €" },
      { id: "seed-bali-44-7", month: "Ekim", price: "9200 €" },
      { id: "seed-bali-44-8", month: "Kasim", price: "8800 €" },
    ],
  },
  {
    id: "seed-bavaria-46-firststep",
    slug: "bavaria-46-firststep",
    name: "Bavaria 46 FirstStep",
    model: "Bavaria 46",
    year: 2022,
    cabins: 4,
    guestsLabel: "8 Kisi",
    location: "Bodrum",
    image: "/charter/bavaria-46-firststep.jpg",
    shortNote: "Yeni nesil Bavaria 46, konfor ve performans dengesi.",
    description:
      "Bavaria 46 FirstStep, hem performans hem konfor sunan modern bir yelkenli teknedir. Aileler ve arkadas gruplari icin ideal charter secenegidir.",
    features:
      "4 kabin\n3 WC\nGenis kokpit\nModern navigasyon sistemleri\nKonforlu yasam alani",
    prices: [
      { id: "seed-firststep-1", month: "Nisan", price: "4100 €" },
      { id: "seed-firststep-2", month: "Mayis", price: "4300 €" },
      { id: "seed-firststep-3", month: "Haziran", price: "4500 €" },
      { id: "seed-firststep-4", month: "Temmuz", price: "4900 €" },
      { id: "seed-firststep-5", month: "Agustos", price: "4900 €" },
      { id: "seed-firststep-6", month: "Eylul", price: "4900 €" },
      { id: "seed-firststep-7", month: "Ekim", price: "4500 €" },
      { id: "seed-firststep-8", month: "Kasim", price: "4100 €" },
    ],
  },
  {
    id: "seed-bavaria-46-dragutl",
    slug: "bavaria-46-dragutl",
    name: "Bavaria 46 DragutL",
    model: "Bavaria 46",
    year: 2024,
    cabins: 4,
    guestsLabel: "8 Kisi",
    location: "Bodrum",
    image: "/charter/bavaria-46-dragutl.jpg",
    shortNote:
      "Yeni model, indirimli sezon firsatlari ile guclu charter teknesi.",
    description:
      "Bavaria 46 DragutL, modern donanimi ve genis yasam alani ile ust segment bir charter deneyimi sunar. Yeni model olmasi sebebiyle maksimum konfor saglar.",
    features:
      "4 kabin\n3 WC\nGunes paneli\nInverter\nModern mutfak\nGenis yasam alani",
    prices: [
      { id: "seed-dragutl-1", month: "Nisan", price: "3700 €" },
      { id: "seed-dragutl-2", month: "Mayis", price: "4300 €" },
      { id: "seed-dragutl-3", month: "Haziran", price: "4600 €" },
      { id: "seed-dragutl-4", month: "Temmuz", price: "4900 €" },
      { id: "seed-dragutl-5", month: "Agustos", price: "4900 €" },
      { id: "seed-dragutl-6", month: "Eylul", price: "4600 €" },
      { id: "seed-dragutl-7", month: "Ekim", price: "4500 €" },
      { id: "seed-dragutl-8", month: "Kasim", price: "3700 €" },
    ],
  },
  {
    id: "seed-beneteau-oceanis-41-draguts",
    slug: "beneteau-oceanis-41-draguts",
    name: "Beneteau Oceanis 41 DragutS",
    model: "Beneteau Oceanis 41",
    year: 2016,
    cabins: 3,
    guestsLabel: "6-8 Kisi",
    location: "Bodrum",
    image: "/charter/oceanis-41-draguts.jpg",
    shortNote:
      "Ekonomik ve dengeli, egitim sonrasi charter icin ideal tekne.",
    description:
      "Beneteau Oceanis 41 DragutS, kullanim kolayligi ve dengeli yapisiyla hem yeni baslayanlar hem de deneyimli denizciler icin ideal bir charter secenegidir.",
    features:
      "3 kabin\n2 WC\nKonforlu ic hacim\nKolay manevra\nEkonomik kullanim",
    prices: [
      { id: "seed-draguts-1", month: "Nisan", price: "2600 €" },
      { id: "seed-draguts-2", month: "Mayis", price: "2800 €" },
      { id: "seed-draguts-3", month: "Haziran", price: "3200 €" },
      { id: "seed-draguts-4", month: "Temmuz", price: "3400 €" },
      { id: "seed-draguts-5", month: "Agustos", price: "3400 €" },
      { id: "seed-draguts-6", month: "Eylul", price: "3400 €" },
      { id: "seed-draguts-7", month: "Ekim", price: "3200 €" },
      { id: "seed-draguts-8", month: "Kasim", price: "2900 €" },
    ],
  },
];