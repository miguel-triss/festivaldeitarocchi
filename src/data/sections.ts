// The page, in order. One source for the menu, the Passaporto degli Arcani
// (one stamp per section) and the page itself. Scenes follow the day:
// dawn in the hero, day, dusk, and the Notte degli Arcani at the end.
export type Scene = "day" | "rose" | "dusk" | "night";
export type StampSymbol = "sun" | "moon" | "star" | "arch" | "eye";

export interface Section {
  id: string;
  numeral: string;
  title: string;
  scene: Scene;
  symbol: StampSymbol;
}

export const sections: Section[] = [
  { id: "visione", numeral: "01", title: "Visione", scene: "day", symbol: "eye" },
  { id: "tarocchi", numeral: "02", title: "Perché i Tarocchi", scene: "day", symbol: "star" },
  { id: "festival", numeral: "03", title: "Il Festival in breve", scene: "rose", symbol: "sun" },
  { id: "fabbrica", numeral: "04", title: "Fabbrica del Vapore", scene: "day", symbol: "arch" },
  { id: "dimore", numeral: "05", title: "Come funziona una Dimora", scene: "rose", symbol: "arch" },
  { id: "contenuti", numeral: "06", title: "I contenuti del Festival", scene: "day", symbol: "star" },
  { id: "partner", numeral: "07", title: "Diventare partner", scene: "dusk", symbol: "sun" },
  { id: "rete", numeral: "08", title: "Una rete culturale", scene: "dusk", symbol: "moon" },
  { id: "chi-siamo", numeral: "09", title: "Chi siamo", scene: "night", symbol: "eye" },
  { id: "notte", numeral: "10", title: "La Notte degli Arcani", scene: "night", symbol: "moon" },
  { id: "partecipa", numeral: "11", title: "Come partecipare", scene: "night", symbol: "star" },
];

export const CONTACT_EMAIL = "ftvtarocchi@ecatestudio.org";

// Where the contact form is delivered. FormSubmit relays to an inbox without
// a backend: the first submission triggers an activation email to that inbox.
// After activation, replace the address with the random alias FormSubmit
// provides, so the inbox is not exposed in the page source.
export const FORM_TO = "miguel@lunaria.agency";
export const FORM_ENDPOINT = `https://formsubmit.co/${FORM_TO}`;
export const FORM_AJAX = `https://formsubmit.co/ajax/${FORM_TO}`;
export const mailto = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
