// The 22 Major Arcana. Names: classic Italian Marseille tradition, to be
// checked with the client (the source text names only nine of them).
//
// Illustrations are original line drawings in the spirit of the moodboard
// cards (La Stella, Il Mondo, Il Sole): gold and cream lines on night, a few
// flat palette fills, every scene set inside an arch. Coordinates live in
// the card's art window: x 40..180, y 70..320 (see Card.astro).

import { SUN_DISC, sunMarkup } from "../lib/sun";
import { art } from "./arcana-art";

export interface Arcanum {
  n: number;
  numeral: string;
  name: string;
  art?: string;
  aspect: string; // one aspect of the Festival, from the source text
}

const G = "var(--c-gold)";
const C = "var(--c-cream)";
const P = "var(--c-pink)";
const T = "var(--c-terra)";
const V = "var(--c-violet)";
const GR = "var(--c-green)";
const M = "var(--c-magenta)";

const sparkle = (x: number, y: number, r: number, fill = G) =>
  `<path fill="${fill}" d="M${x} ${y - r}C${x + r * 0.07} ${y - r * 0.28} ${x + r * 0.28} ${y - r * 0.07} ${x + r} ${y}C${x + r * 0.28} ${y + r * 0.07} ${x + r * 0.07} ${y + r * 0.28} ${x} ${y + r}C${x - r * 0.07} ${y + r * 0.28} ${x - r * 0.28} ${y + r * 0.07} ${x - r} ${y}C${x - r * 0.28} ${y - r * 0.07} ${x - r * 0.07} ${y - r * 0.28} ${x} ${y - r}Z"/>`;

const line = (d: string, stroke = C, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---- XIX Il Sole -------------------------------------------------------
// the festival's own sun, extracted from the design files
const SS = 0.72;
const sole = `
  <g transform="translate(${110 - SUN_DISC.cx * SS} ${130 - SUN_DISC.cy * SS}) scale(${SS})">${sunMarkup()}</g>
  ${[[70, 208], [150, 204], [92, 228], [130, 226], [110, 212]]
    .map(([x, y]) => `<path d="M${x} ${y - 6}Q${x + 3.4} ${y} ${x} ${y + 3}Q${x - 3.4} ${y} ${x} ${y - 6}Z" fill="${G}"/>`)
    .join("")}
  <rect x="40" y="266" width="140" height="54" fill="${T}"/>
  ${line("M40 266H180M40 280H180M40 294H180M40 308H180", C, 0.9)}
  ${line("M60 266V280M90 266V280M120 266V280M150 266V280M75 280V294M105 280V294M135 280V294M165 280V294M60 294V308M90 294V308M120 294V308M150 294V308", C, 0.9)}
  ${[62, 158]
    .map(
      (x) => `
    ${line(`M${x} 266C${x - 3} 252 ${x + 3} 240 ${x} 226`, GR, 2.2)}
    <path d="M${x} 252Q${x + 12} 244 ${x + 14} 250Q${x + 6} 258 ${x} 252Z" fill="${GR}"/>
    <path d="M${x} 244Q${x - 12} 236 ${x - 14} 242Q${x - 6} 250 ${x} 244Z" fill="${GR}"/>
    <g transform="translate(${x} 222)">
      ${Array.from({ length: 12 }, (_, i) => `<ellipse rx="2.6" ry="7" cy="-8" fill="${G}" transform="rotate(${i * 30})"/>`).join("")}
      <circle r="5" fill="${T}"/>
    </g>`,
    )
    .join("")}
`;

// ---- XVII La Stella ----------------------------------------------------
const stella = `
  <g transform="translate(110 132)">
    ${Array.from({ length: 8 }, (_, i) => `<path d="M0 -40L6 -6L0 0Z" fill="${G}" transform="rotate(${i * 45})"/><path d="M0 -40L-6 -6L0 0Z" fill="${G}" opacity=".6" transform="rotate(${i * 45})"/>`).join("")}
    ${Array.from({ length: 8 }, (_, i) => `<path d="M0 -22L3 -4L0 0Z" fill="${C}" transform="rotate(${i * 45 + 22.5})"/>`).join("")}
  </g>
  ${sparkle(62, 104, 7)}${sparkle(158, 104, 7)}${sparkle(52, 156, 6)}${sparkle(168, 156, 6)}
  ${sparkle(78, 196, 5)}${sparkle(142, 196, 5)}${sparkle(110, 188, 4, C)}
  <!-- left jug pours -->
  <g transform="translate(72 236) rotate(-38)">
    <path d="M-9 -14Q-12 -2 -8 8Q0 14 8 8Q12 -2 9 -14Z" fill="${M}"/>
    <path d="M-6 -14V-19H6V-14" fill="none" stroke="${C}" stroke-width="1.4"/>
    <path d="M9 -8Q16 -6 13 2" fill="none" stroke="${C}" stroke-width="1.4"/>
  </g>
  ${line("M64 222C62 238 70 262 84 284", C, 1.6)}
  <!-- right jug pours -->
  <g transform="translate(148 236) rotate(38)">
    <path d="M-9 -14Q-12 -2 -8 8Q0 14 8 8Q12 -2 9 -14Z" fill="${P}"/>
    <path d="M-6 -14V-19H6V-14" fill="none" stroke="${C}" stroke-width="1.4"/>
    <path d="M-9 -8Q-16 -6 -13 2" fill="none" stroke="${C}" stroke-width="1.4"/>
  </g>
  ${line("M156 222C158 238 150 262 136 284", C, 1.6)}
  <path d="M40 288Q60 280 76 290Q76 320 40 320Z" fill="${GR}"/>
  <path d="M180 292Q162 284 146 294Q148 320 180 320Z" fill="${GR}"/>
  ${line("M52 288C50 276 54 268 50 260M50 270Q44 266 42 270M52 280Q58 276 60 280", GR, 1.6)}
  ${line("M76 296Q92 290 108 296T140 296", C, 1.1)}
  ${line("M64 306Q80 300 96 306T128 306T160 306", C, 1.1)}
  ${line("M70 315Q86 309 102 315T134 315T166 315", C, 0.9)}
`;

// ---- 0 Il Matto --------------------------------------------------------
const matto = `
  <g transform="translate(150 112)">
    <circle r="11" fill="${G}"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M0 -14V-21" stroke="${G}" stroke-width="1.6" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join("")}
  </g>
  ${sparkle(70, 110, 6)}${sparkle(92, 146, 4, C)}${sparkle(60, 176, 3.5)}
  <!-- the road towards the edge -->
  <path d="M40 320C70 300 90 290 104 262C114 244 130 238 150 236" fill="none" stroke="${C}" stroke-width="1" stroke-dasharray="2 4"/>
  <!-- the cliff: land ends, the unknown opens -->
  <path d="M104 262L180 250V320H40V300Q70 290 88 276Z" fill="${GR}"/>
  <path d="M148 236L180 232V250L150 252Z" fill="${GR}" opacity=".75"/>
  <!-- the bindle: a staff and a knotted bundle -->
  ${line("M78 300L140 170", C, 2.4)}
  <path d="M140 170C150 160 166 164 166 178C166 192 148 196 140 186C134 180 134 174 140 170Z" fill="${T}"/>
  ${line("M140 170Q146 166 152 170M146 188Q154 182 160 186", C, 1)}
  <!-- a small white rose, carried along -->
  <g transform="translate(76 240)">
    ${line("M0 0C2 10 -2 20 2 30", GR, 1.6)}
    <path d="M2 16Q10 12 12 18Q6 22 2 16Z" fill="${GR}"/>
    <circle r="7" fill="${C}"/>
    ${line("M-3 -1Q0 -4 3 -1Q1 3 -2 1", P, 1.1)}
  </g>
  <!-- the dog, leaping at the heels -->
  <g transform="translate(106 280)" fill="${P}" stroke="${P}" stroke-linecap="round">
    <ellipse cx="20" cy="14" rx="15" ry="6.5" stroke="none"/>
    <path d="M30 10Q34 6 38 6L40 12Q36 16 31 17Z" stroke="none"/>
    <circle cx="40" cy="7" r="5.5" stroke="none"/>
    <path d="M43 5L51 7.5L44 10.5Z" stroke="none"/>
    <path d="M37 3L38 -5L42 2Z" stroke="none"/>
    <path d="M6 11Q-2 6 -1 -3" fill="none" stroke-width="2.4"/>
    <path d="M31 17L41 23M28 18L36 26M9 17L-1 22M11 18L3 27" fill="none" stroke-width="2.8"/>
  </g>
`;

export const arcana: Arcanum[] = [
  { n: 0, numeral: "0", name: "Il Matto", art: matto, aspect: "Ogni visitatore decide autonomamente l'ordine delle proprie tappe." },
  { n: 1, numeral: "I", name: "Il Bagatto", art: art[1], aspect: "Opere d'arte contemporanea, installazioni, incontri, performance." },
  { n: 2, numeral: "II", name: "La Papessa", art: art[2], aspect: "Conferenze e conversazioni, tavole rotonde, presentazioni editoriali." },
  { n: 3, numeral: "III", name: "L'Imperatrice", art: art[3], aspect: "Ogni edizione aggiunge opere alla Collezione Permanente e materiali all'Archivio." },
  { n: 4, numeral: "IV", name: "L'Imperatore", art: art[4], aspect: "La Fabbrica del Vapore: una sede unica e riconoscibile." },
  { n: 5, numeral: "V", name: "Il Papa", art: art[5], aspect: "Masterclass, visite e attività guidate, progetti educational." },
  { n: 6, numeral: "VI", name: "Gli Amanti", art: art[6], aspect: "Artisti, studiosi, curatori, istituzioni e aziende costruiscono insieme il progetto." },
  { n: 7, numeral: "VII", name: "Il Carro", art: art[7], aspect: "Dalle prime Dimore alla configurazione completa dei ventidue Arcani." },
  { n: 8, numeral: "VIII", name: "La Giustizia", art: art[8], aspect: "Il Premio Festival dei Tarocchi, a chi ha dato un contributo significativo alla loro cultura." },
  { n: 9, numeral: "IX", name: "L'Eremita", art: art[9], aspect: "Ricerca, archivio, pubblicazioni: la conoscenza della storia dei Tarocchi." },
  { n: 10, numeral: "X", name: "La Ruota", art: art[10], aspect: "Tre giorni, un Hub Principale e le Dimore degli Arcani." },
  { n: 11, numeral: "XI", name: "La Forza", art: art[11], aspect: "Una Call for Artists chiama gli artisti a lavorare sui diversi Arcani." },
  { n: 12, numeral: "XII", name: "L'Appeso", art: art[12], aspect: "Nuove opere e nuove interpretazioni, a partire dalla storia." },
  { n: 13, numeral: "XIII", name: "La Morte", art: art[13], aspect: "Le interpretazioni che entreranno nella storia futura dei Tarocchi." },
  { n: 14, numeral: "XIV", name: "La Temperanza", art: art[14], aspect: "Workshop e laboratori: le Esperienze del Festival." },
  { n: 15, numeral: "XV", name: "Il Diavolo", art: art[15], aspect: "Performance e podcast dal vivo." },
  { n: 16, numeral: "XVI", name: "La Torre", art: art[16], aspect: "Installazioni fatte di luce, suono, immagini, materiali, video o tecnologie digitali." },
  { n: 17, numeral: "XVII", name: "La Stella", art: stella, aspect: "Una Dimora per ogni Arcano Maggiore." },
  { n: 18, numeral: "XVIII", name: "La Luna", art: art[18], aspect: "La domenica sera, la Notte degli Arcani." },
  { n: 19, numeral: "XIX", name: "Il Sole", art: sole, aspect: "L'Hub Principale: informazioni, Passaporto, bookshop, pubblicazioni." },
  { n: 20, numeral: "XX", name: "Il Giudizio", art: art[20], aspect: "La Direzione Artistica seleziona un'opera per la Collezione Permanente." },
  { n: 21, numeral: "XXI", name: "Il Mondo", art: art[21], aspect: "Milano Open City: musei, fondazioni, università e luoghi della città." },
];
