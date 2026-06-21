export type Chapter = {
  id: number;
  title: string;
  summary: string;
  verses: number;
};

export type Scripture = {
  id: string;
  category: "veda" | "purana";
  name: string;
  sanskrit: string;
  description: string;
  estimatedVerses: string;
  historicalSignificance: string;
  chapters: Chapter[];
  resources: Array<{
    type: "pdf" | "epub" | "audio" | "translation";
    title: string;
    href: string;
  }>;
};

const sampleChapters = (prefix: string): Chapter[] => [
  {
    id: 1,
    title: `${prefix} Invocation`,
    summary: "Opening hymns and cosmological invocations.",
    verses: 42,
  },
  {
    id: 2,
    title: `${prefix} Wisdom`,
    summary: "Teachings on dharma, devotion, and inner discipline.",
    verses: 58,
  },
  {
    id: 3,
    title: `${prefix} Practice`,
    summary: "Ritual context, meditative insight, and practical ethics.",
    verses: 36,
  },
  {
    id: 4,
    title: `${prefix} Realization`,
    summary: "Reflections on liberation and timeless consciousness.",
    verses: 63,
  },
];

export const vedas: Scripture[] = [
  {
    id: "rigveda",
    category: "veda",
    name: "Rigveda",
    sanskrit: "ऋग्वेद",
    description: "Oldest Vedic collection of hymns dedicated to cosmic forces.",
    estimatedVerses: "10,552 verses",
    historicalSignificance: "Foundation of Vedic liturgy, poetry, and philosophical symbolism.",
    chapters: sampleChapters("Rigveda"),
    resources: [
      { type: "pdf", title: "Rigveda Critical PDF", href: "#" },
      { type: "epub", title: "Rigveda Digital EPUB", href: "#" },
      { type: "audio", title: "Rigveda Chanting Audio", href: "#" },
      { type: "translation", title: "English Translation", href: "#" },
    ],
  },
  {
    id: "yajurveda",
    category: "veda",
    name: "Yajurveda",
    sanskrit: "यजुर्वेद",
    description: "Veda of ritual formulas and sacrificial liturgical guidance.",
    estimatedVerses: "1,975 mantras",
    historicalSignificance: "Core manual for yajna tradition and ritual structure.",
    chapters: sampleChapters("Yajurveda"),
    resources: [
      { type: "pdf", title: "Yajurveda Ritual PDF", href: "#" },
      { type: "epub", title: "Yajurveda EPUB", href: "#" },
      { type: "audio", title: "Yajurveda Recitation", href: "#" },
      { type: "translation", title: "Hindi Translation", href: "#" },
    ],
  },
  {
    id: "samaveda",
    category: "veda",
    name: "Samaveda",
    sanskrit: "सामवेद",
    description: "Melodic rendering of Vedic hymns for sacred chanting.",
    estimatedVerses: "1,875 verses",
    historicalSignificance: "Primary source of Vedic musical and sonic tradition.",
    chapters: sampleChapters("Samaveda"),
    resources: [
      { type: "pdf", title: "Samaveda PDF", href: "#" },
      { type: "epub", title: "Samaveda Musical EPUB", href: "#" },
      { type: "audio", title: "Samaveda Vocal Notes", href: "#" },
      { type: "translation", title: "Annotated Translation", href: "#" },
    ],
  },
  {
    id: "atharvaveda",
    category: "veda",
    name: "Atharvaveda",
    sanskrit: "अथर्ववेद",
    description: "Veda of daily life, healing prayers, and metaphysical reflections.",
    estimatedVerses: "5,977 verses",
    historicalSignificance: "Bridges ritual life with medicine, polity, and spirituality.",
    chapters: sampleChapters("Atharvaveda"),
    resources: [
      { type: "pdf", title: "Atharvaveda PDF", href: "#" },
      { type: "epub", title: "Atharvaveda EPUB", href: "#" },
      { type: "audio", title: "Healing Mantra Audio", href: "#" },
      { type: "translation", title: "Scholarly Translation", href: "#" },
    ],
  },
];

const puranaNames = [
  "Brahma Purana",
  "Padma Purana",
  "Vishnu Purana",
  "Shiva Purana",
  "Bhagavata Purana",
  "Narada Purana",
  "Markandeya Purana",
  "Agni Purana",
  "Bhavishya Purana",
  "Brahmavaivarta Purana",
  "Linga Purana",
  "Varaha Purana",
  "Skanda Purana",
  "Vamana Purana",
  "Kurma Purana",
  "Matsya Purana",
  "Garuda Purana",
  "Brahmanda Purana",
];

export const mahapuranas: Scripture[] = puranaNames.map((name) => ({
  id: name.toLowerCase().replace(/\s+/g, "-"),
  category: "purana",
  name,
  sanskrit: "पुराण",
  description: `${name} presents mythology, cosmology, ethics, pilgrimage lore, and bhakti traditions.`,
  estimatedVerses: "Varies by recension",
  historicalSignificance: "A major source of Itihasa-Purana memory and regional devotional culture.",
  chapters: sampleChapters(name),
  resources: [
    { type: "pdf", title: `${name} PDF Edition`, href: "#" },
    { type: "epub", title: `${name} EPUB Edition`, href: "#" },
    { type: "audio", title: `${name} Audio Recitation`, href: "#" },
    { type: "translation", title: `${name} Translation Pack`, href: "#" },
  ],
}));

export const allScriptures: Scripture[] = [...vedas, ...mahapuranas];

export const quoteOfDay = {
  sanskrit: "सत्यं वद । धर्मं चर ।",
  transliteration: "Satyam vada, dharmam chara.",
  meaning: "Speak truth. Walk in dharma.",
};

export const dailyWisdom = [
  "Every sincere reading is a pilgrimage inward.",
  "Wisdom grows when study meets contemplation.",
  "Preservation of knowledge is a sacred service.",
  "A single verse lived deeply can transform a life.",
];

export const randomVerses = [
  "From the unreal lead me to the real.",
  "Let noble thoughts come to us from all sides.",
  "The self is to be seen, heard, reflected upon, meditated upon.",
  "Action done in awareness becomes worship.",
];
