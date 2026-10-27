// SPDX-License-Identifier: GPL-3.0-only

import type { LocaleCode } from "./types";

/** Expected localized aliases for disclosure and promotional surfaces; variants are exact alternatives. */
export type DisclosureLabels = readonly [
  ad: string,
  aiInfo: string,
  metaAiBrand: string,
  metaAiCopy: string,
];

/** Detection considers every locale together, independently of the user's settings language. */
export const disclosureLabels: Record<LocaleCode, DisclosureLabels> = {
  en: ["Ad", "AI info", "Visit Meta AI|Meta AI branding", "Try Meta AI|Free AI creation tools"],
  ar: [
    "إعلان",
    "معلومات الذكاء الاصطناعي|معلومات عن الذكاء الاصطناعي",
    "زيارة Meta AI|علامة Meta AI التجارية",
    "جرّب Meta AI|أدوات إنشاء مجانية بالذكاء الاصطناعي",
  ],
  bg: [
    "Реклама",
    "Информация за AI|Информация за ИИ",
    "Посетете Meta AI|Брандиране на Meta AI",
    "Изпробвайте Meta AI|Безплатни инструменти за създаване с AI",
  ],
  cs: [
    "Reklama",
    "Informace o AI",
    "Navštívit Meta AI|Značka Meta AI",
    "Vyzkoušejte Meta AI|Bezplatné nástroje pro tvorbu s AI",
  ],
  de: [
    "Anzeige|Werbung",
    "KI-Info|KI-Informationen",
    "Meta AI besuchen|Meta AI-Branding",
    "Meta AI ausprobieren|Kostenlose KI-Kreativtools",
  ],
  el: [
    "Διαφήμιση",
    "Πληροφορίες AI|Πληροφορίες τεχνητής νοημοσύνης",
    "Επισκεφτείτε το Meta AI|Επωνυμία Meta AI",
    "Δοκιμάστε το Meta AI|Δωρεάν εργαλεία δημιουργίας AI",
  ],
  es: [
    "Anuncio",
    "Información de IA|Información sobre IA",
    "Visitar Meta AI|Marca de Meta AI",
    "Prueba Meta AI|Herramientas gratuitas de creación con IA",
  ],
  fi: [
    "Mainos",
    "Tekoälytiedot|Tietoja tekoälystä",
    "Siirry Meta AI:hin|Meta AI -brändäys",
    "Kokeile Meta AI:ta|Maksuttomat tekoälyluontityökalut",
  ],
  fr: [
    "Publicité|Pub",
    "Infos IA|Informations sur l’IA|Informations sur l'IA",
    "Visiter Meta AI|Marque Meta AI",
    "Essayez Meta AI|Outils de création IA gratuits",
  ],
  he: [
    "מודעה",
    "מידע על AI|מידע על בינה מלאכותית",
    "ביקור ב-Meta AI|מיתוג Meta AI",
    "נסו את Meta AI|כלי יצירה חינמיים עם בינה מלאכותית",
  ],
  id: [
    "Iklan",
    "Info AI",
    "Kunjungi Meta AI|Branding Meta AI",
    "Coba Meta AI|Alat kreasi AI gratis",
  ],
  it: [
    "Inserzione|Pubblicità",
    "Informazioni sull'IA|Informazioni sull’IA",
    "Visita Meta AI|Branding di Meta AI",
    "Prova Meta AI|Strumenti di creazione IA gratuiti",
  ],
  ja: [
    "広告",
    "AI情報|AIに関する情報",
    "Meta AIにアクセス|Meta AIのブランド",
    "Meta AIを試す|無料のAI作成ツール",
  ],
  lv: [
    "Reklāma",
    "MI informācija|Informācija par MI",
    "Apmeklēt Meta AI|Meta AI zīmols",
    "Izmēģiniet Meta AI|Bezmaksas MI satura veidošanas rīki",
  ],
  nl: [
    "Advertentie",
    "AI-info|AI-informatie",
    "Meta AI bezoeken|Meta AI-branding",
    "Probeer Meta AI|Gratis AI-creatietools",
  ],
  pl: [
    "Reklama",
    "Informacje o AI|Informacje o sztucznej inteligencji",
    "Odwiedź Meta AI|Marka Meta AI",
    "Wypróbuj Meta AI|Bezpłatne narzędzia do tworzenia z AI",
  ],
  pt: [
    "Anúncio",
    "Informações de IA|Informações sobre IA",
    "Visitar Meta AI|Marca da Meta AI",
    "Experimenta a Meta AI|Experimente a Meta AI|Ferramentas gratuitas de criação com IA",
  ],
  ru: [
    "Реклама",
    "Информация об ИИ",
    "Посетить Meta AI|Брендинг Meta AI",
    "Попробуйте Meta AI|Бесплатные инструменты для творчества с ИИ",
  ],
  tr: [
    "Reklam",
    "Yapay zeka bilgisi|Yapay zekâ bilgisi",
    "Meta AI'ı ziyaret et|Meta AI markası",
    "Meta AI'ı dene|Ücretsiz yapay zeka oluşturma araçları",
  ],
  uk: [
    "Реклама",
    "Інформація про ШІ",
    "Відвідати Meta AI|Брендинг Meta AI",
    "Спробуйте Meta AI|Безкоштовні інструменти для творчості зі ШІ",
  ],
  vi: [
    "Quảng cáo",
    "Thông tin về AI|Thông tin AI",
    "Truy cập Meta AI|Thương hiệu Meta AI",
    "Dùng thử Meta AI|Công cụ sáng tạo AI miễn phí",
  ],
  "zh-Hans": [
    "广告",
    "AI 信息|AI信息|人工智能信息",
    "访问 Meta AI|Meta AI 品牌",
    "试用 Meta AI|免费 AI 创作工具",
  ],
  "zh-Hant": [
    "廣告",
    "AI 資訊|AI資訊|人工智慧資訊",
    "造訪 Meta AI|Meta AI 品牌",
    "試用 Meta AI|免費 AI 創作工具",
  ],
};
