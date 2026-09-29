// Illustrations for 19 of the 22 Arcana (0, XVII and XIX live in arcana.ts).
// Emblems rather than figures: each card keeps the one or two signs that make
// it recognisable in the Marseille tradition, drawn with the shared
// vocabulary of src/lib/draw.ts. Art window: x 40..180, y 70..320.
import {
  G, C, P, T, V, GR, GRL, GRW, M, N, NM,
  sparkle, line, shape, dot, ring, cloud, wheat, goblet, chain, flower, leaf, infinity, waves, hill, around,
} from "../lib/draw";

// I · Il Bagatto: the table of the four tools, the sign of infinity above
const bagatto = `
  ${infinity(110, 104, 14)}
  ${sparkle(64, 120, 5)}${sparkle(156, 128, 4)}${sparkle(80, 158, 3, C)}
  ${line("M146 132L128 214", C, 2.6)}${sparkle(147, 128, 7, C)}
  ${hill(300)}
  ${shape("M48 232H172V244H48Z", T)}
  ${shape("M52 244H168L162 262H58Z", T, 'opacity=".75"')}
  ${line("M60 262V300M160 262V300", C, 2)}
  ${goblet(70, 232, 0.8)}
  <circle cx="98" cy="224" r="8" fill="${G}"/>${sparkle(98, 224, 4, N)}
  ${line("M118 232L140 202M120 212L130 222", C, 2)}
  ${dot(152, 228, 4, P)}${dot(160, 226, 3, M)}
`;

// II · La Papessa: the veil between two pillars, the open book, the triple moon
const papessa = `
  <circle cx="110" cy="100" r="8" fill="${C}"/>
  <path d="M92 94a8 8 0 1 0 0 12a6.4 6.4 0 0 1 0-12z" fill="${G}"/>
  <path d="M128 94a8 8 0 1 1 0 12a6.4 6.4 0 0 0 0-12z" fill="${G}"/>
  ${shape("M50 128H70V320H50Z", N, `stroke="${C}" stroke-width="1"`)}${shape("M46 120H74V130H46Z", N, `stroke="${C}" stroke-width="1"`)}
  ${shape("M150 128H170V320H150Z", C)}${shape("M146 120H174V130H146Z", C)}
  <text x="60" y="160" text-anchor="middle" font-family="Cormorant, serif" font-size="12" font-weight="700" fill="${C}">B</text>
  <text x="160" y="160" text-anchor="middle" font-family="Cormorant, serif" font-size="12" font-weight="700" fill="${N}">J</text>
  ${shape("M70 134Q80 142 90 134Q100 142 110 134Q120 142 130 134Q140 142 150 134V252Q130 244 110 252Q90 244 70 252Z", P, 'opacity=".9"')}
  ${[[84, 160], [110, 176], [136, 160], [84, 210], [136, 210], [110, 228]].map(([x, y]) => dot(x, y, 4, M)).join("")}
  ${shape("M84 262Q97 256 110 262V288Q97 282 84 288Z", C)}${shape("M136 262Q123 256 110 262V288Q123 282 136 288Z", C)}
  ${line("M90 268H104M90 274H104M116 268H130M116 274H130", NM, 0.8)}
  <path d="M100 306a10 10 0 1 0 20 0a8 8 0 0 1 -20 0z" fill="${G}"/>
`;

// III · L'Imperatrice: a crown of twelve stars, the sign of Venus, ripe wheat
const imperatrice = `
  ${around(110, 170, 56, 200, 340, 12).map(([x, y]) => sparkle(x, y, 4.2)).join("")}
  <circle cx="110" cy="186" r="20" fill="${M}"/>${ring(110, 186, 20, G, 3)}
  ${line("M110 206V240M98 224H122", G, 3.2)}
  ${sparkle(110, 186, 7, C)}
  ${hill(292)}
  ${wheat(56, 296, 46, -12)}${wheat(68, 298, 52, -4)}${wheat(80, 300, 40, 6)}
  ${wheat(140, 300, 40, -6)}${wheat(152, 298, 52, 4)}${wheat(164, 296, 46, 12)}
  ${flower(98, 300, 4, P)}${flower(122, 302, 4, C)}
`;

// IV · L'Imperatore: the stone throne before the mountains, orb and sceptre, crown
const imperatore = `
  ${shape("M94 122L100 108L110 118L120 108L126 122L124 136H96Z", G)}
  ${dot(100, 106, 2.2, C)}${dot(120, 106, 2.2, C)}${dot(110, 116, 2.2, C)}
  ${shape("M40 252L68 194L88 226L114 172L146 234L164 206L180 232V320H40Z", V)}
  ${line("M108 184L114 172L121 186M62 206L68 194L73 204", C, 1.2)}
  ${shape("M72 240H148V306H72Z", T)}
  ${line("M72 254H148", C, 1)}
  ${line("M76 240c-8 -2 -10 -12 -2 -14c6 -1 8 6 3 8", C, 1.6)}${line("M144 240c8 -2 10 -12 2 -14c-6 -1 -8 6 -3 8", C, 1.6)}
  <circle cx="92" cy="226" r="8" fill="${G}"/>${line("M92 214V218M89 216H95", G, 1.6)}
  ${line("M132 238V194", G, 2.6)}<ellipse cx="132" cy="188" rx="5" ry="7" fill="none" stroke="${G}" stroke-width="2.4"/>${line("M125 202H139", G, 2.4)}
  ${hill(308, GR)}
`;

// V · Il Papa: the triple crown over the crossed keys, between two columns
const papa = `
  ${shape("M95 150Q95 106 110 100Q125 106 125 150Z", G)}
  ${line("M96 120H124M95 134H125M95 146H125", N, 1.4)}
  ${line("M110 100V90M105 94H115", G, 2)}
  ${[-40, 40].map((d) => `<g transform="translate(110 228) rotate(${d})">${ring(0, -40, 8, d < 0 ? G : C, 3)}${line("M0 -32V34", d < 0 ? G : C, 3)}${line("M0 22H10M0 30H8M10 22V30", d < 0 ? G : C, 2.4)}</g>`).join("")}
  ${shape("M48 170H62V320H48Z", NM, `stroke="${C}" stroke-width="1"`)}${shape("M158 170H172V320H158Z", NM, `stroke="${C}" stroke-width="1"`)}
  ${shape("M44 162H66V172H44Z", C)}${shape("M154 162H176V172H154Z", C)}
  ${sparkle(76, 110, 4)}${sparkle(146, 112, 5)}
  ${hill(304)}
`;

// VI · Gli Amanti: Love's bow over two roses that lean together
const amanti = `
  ${line("M84 116Q110 88 136 116", G, 2.4)}${line("M84 116H136", C, 0.9)}
  ${line("M110 116V162", C, 1.8)}${shape("M104 158L110 170L116 158Z", C)}
  ${shape("M106 116L110 108L114 116Z", C)}
  ${[[64, 100], [156, 100], [74, 140], [146, 140]].map(([x, y]) => sparkle(x, y, 4)).join("")}
  ${line("M66 320C66 280 84 252 100 230", GR, 2.6)}${line("M154 320C154 280 136 252 120 230", GR, 2.6)}
  ${leaf(78, 276, 18, -60)}${leaf(142, 276, 18, -120)}${leaf(88, 252, 14, -140)}${leaf(132, 252, 14, -40)}
  <circle cx="99" cy="222" r="12" fill="${M}"/>${line("M99 222m-6 0a6 6 0 1 1 6 6a3.5 3.5 0 1 1 -3 -4", P, 1.3)}
  <circle cx="121" cy="222" r="12" fill="${P}"/>${line("M121 222m-6 0a6 6 0 1 1 6 6a3.5 3.5 0 1 1 -3 -4", M, 1.3)}
  ${sparkle(110, 196, 5, C)}
  ${hill(306)}
`;

// VII · Il Carro: the starred canopy, the chariot and its wheels on the road
const carro = `
  ${shape("M64 150H156L146 166H74Z", V)}
  ${[76, 92, 110, 128, 144].map((x) => sparkle(x, 157, 3.2)).join("")}
  ${line("M76 166V236M144 166V236", C, 2)}
  ${sparkle(110, 118, 8)}${dot(80, 112, 1.6, C)}${dot(140, 110, 1.6, C)}
  ${line("M48 318L96 250M172 318L124 250", C, 1)}${line("M60 318L102 250M160 318L118 250", C, 0.6)}
  ${shape("M68 232H152V272H68Z", T)}
  <g transform="translate(110 250)"><circle r="5" fill="${G}"/>${shape("M-6 -1Q-16 -8 -26 -2Q-16 0 -6 3Z", G)}${shape("M6 -1Q16 -8 26 -2Q16 0 6 3Z", G)}</g>
  ${[80, 140].map((x) => `${ring(x, 288, 16, G, 2.6)}${Array.from({ length: 4 }, (_, i) => `<path d="M${x} 272V304" stroke="${G}" stroke-width="1.2" transform="rotate(${i * 45} ${x} 288)"/>`).join("")}${dot(x, 288, 3)}`).join("")}
`;

// VIII · La Giustizia: the upright sword above the balanced scales
const giustizia = `
  ${shape("M107 176L110 94L113 176Z", C)}
  ${line("M96 176H124", G, 3)}${line("M110 176V190", G, 3)}${dot(110, 194, 3.4)}
  ${line("M66 214H154", G, 2)}${line("M110 198V290", G, 2)}${shape("M96 300L110 286L124 300Z", G)}
  ${line("M70 214L58 246M70 214L82 246M150 214L138 246M150 214L162 246", C, 1)}
  ${shape("M54 246Q70 260 86 246Z", G)}${shape("M134 246Q150 260 166 246Z", G)}
  ${shape("M42 150H52V320H42Z", V)}${shape("M168 150H178V320H168Z", V)}
  ${sparkle(76, 120, 4)}${sparkle(144, 120, 4)}
`;

// IX · L'Eremita: the lantern with its star, held out on the staff, on the heights
const eremita = `
  <circle cx="98" cy="176" r="34" fill="${G}" opacity=".16"/>
  ${line("M136 124V300", C, 2.6)}${line("M136 128Q120 128 104 146", C, 1.6)}
  ${shape("M90 150H106L112 162V186L106 196H90L84 186V162Z", NM, `stroke="${G}" stroke-width="2"`)}
  ${shape("M98 164L106 178H90Z", G)}${shape("M98 184L90 170H106Z", G)}
  ${shape("M40 300L70 250L96 286L122 240L156 290L180 262V320H40Z", V)}
  ${line("M116 250L122 240L128 250M64 260L70 250L76 260", C, 1.2)}
  ${sparkle(62, 112, 4)}${sparkle(160, 104, 3)}${dot(150, 150, 1.5, C)}${dot(58, 196, 1.5, C)}
`;

// X · La Ruota: the wheel of fortune among four clouds
const ruota = `
  ${cloud(66, 118, 0.9)}${cloud(154, 118, 0.9)}${cloud(62, 290, 0.9)}${cloud(158, 290, 0.9)}
  ${ring(110, 200, 48, G, 3)}${ring(110, 200, 36, G, 1)}
  ${Array.from({ length: 8 }, (_, i) => `<path d="M110 191V164" stroke="${G}" stroke-width="1.6" transform="rotate(${i * 45} 110 200)"/>`).join("")}
  <circle cx="110" cy="200" r="9" fill="${G}"/>
  ${around(110, 200, 42, 0, 315, 8).map(([x, y], i) => (i % 2 ? dot(x, y, 2.4, C) : sparkle(x, y, 4, C))).join("")}
  ${line("M64 246Q52 214 70 184", M, 3)}${shape("M68 180L76 186L66 190Z", M)}
`;

// XI · La Forza: gentle strength, the lion's head and the sign of infinity
const forza = `
  ${infinity(110, 100, 13)}
  ${around(110, 206, 40, 0, 337.5, 16).map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="13" fill="${T}" transform="rotate(${i * 22.5 + 90} ${x} ${y})"/>`).join("")}
  ${dot(90, 180, 7)}${dot(130, 180, 7)}
  <circle cx="110" cy="206" r="30" fill="${G}"/>
  <ellipse cx="100" cy="200" rx="3" ry="2.2" fill="${N}"/><ellipse cx="120" cy="200" rx="3" ry="2.2" fill="${N}"/>
  ${line("M94 194Q100 191 104 194M116 194Q120 191 126 194", N, 1)}
  ${shape("M104 212H116L110 220Z", N)}
  ${line("M110 220V224M110 224Q104 230 98 228M110 224Q116 230 122 228", N, 1.4)}
  ${[70, 88, 132, 150].map((x, i) => flower(x, 290 + (i % 2) * 8, 5, i % 2 ? C : P)).join("")}
  ${hill(306)}
`;

// XII · L'Appeso: the living gallows, the rope, the upturned halo
const appeso = `
  ${shape("M50 112H170V124H50Z", GR)}${shape("M52 112H64V320H52Z", GR)}${shape("M156 112H168V320H156Z", GR)}
  ${[[58, 150, -90], [58, 196, 90], [162, 170, -90], [162, 226, 90], [80, 118, 0], [140, 118, 180]].map(([x, y, d]) => leaf(x, y, 12, d, GRL)).join("")}
  ${line("M110 124V160", C, 1.6)}
  ${shape("M104 160H116L113 228H107Z", V)}
  ${line("M110 172L128 194L112 204", V, 5)}
  <circle cx="110" cy="246" r="18" fill="none" stroke="${G}" stroke-width="2"/>
  ${around(110, 246, 26, 0, 330, 12).map(([x, y]) => dot(x, y, 1.6)).join("")}
  <circle cx="110" cy="244" r="9" fill="${G}"/>
`;

// XIII · La Morte: the scythe across the field, the white rose, the sun between towers
const morte = `
  ${shape("M62 238H74V270H62Z", NM, `stroke="${C}" stroke-width="1"`)}${shape("M146 238H158V270H146Z", NM, `stroke="${C}" stroke-width="1"`)}
  <path d="M92 270a18 18 0 0 1 36 0z" fill="${G}"/>
  ${Array.from({ length: 7 }, (_, i) => `<path d="M110 248V240" stroke="${G}" stroke-width="1.4" transform="rotate(${-72 + i * 24} 110 270)"/>`).join("")}
  ${shape("M40 270H180V320H40Z", GR)}
  ${waves(284, 2, GRW)}
  ${line("M70 312L150 116", C, 2.6)}
  ${shape("M150 116C128 98 94 100 72 122C96 112 126 114 146 130Z", C)}
  ${line("M144 318C146 304 142 296 146 288", GR, 1.8)}${leaf(146, 304, 10, -30)}
  <circle cx="146" cy="284" r="8" fill="${C}"/>${line("M142 283q4 -4 8 0q-2 4 -5 2", P, 1)}
`;

// XIV · La Temperanza: water poured from cup to cup, the path towards the sun
const temperanza = `
  <circle cx="110" cy="104" r="11" fill="${G}"/>
  ${Array.from({ length: 12 }, (_, i) => `<path d="M110 89V84" stroke="${G}" stroke-width="1.4" transform="rotate(${i * 30} 110 104)"/>`).join("")}
  ${line("M110 118C122 140 98 160 110 182C120 200 104 214 110 230", C, 1)}
  ${goblet(80, 196, 0.9, G, -32)}${goblet(142, 252, 0.9, P, 18)}
  ${line("M72 172C100 166 132 196 136 228", C, 2)}
  ${shape("M40 270Q110 256 180 270V320H40Z", NM)}${waves(282, 3)}
  ${line("M56 270C56 250 60 236 58 222", GR, 1.8)}${flower(58, 218, 5, V, G)}
  ${line("M66 270C66 256 70 246 68 236", GR, 1.6)}${flower(68, 232, 4.4, V, G)}
  ${shape("M100 150L110 134L120 150Z", "none", `stroke="${G}" stroke-width="1.2"`)}
`;

// XV · Il Diavolo: dark wings over the pedestal, the chains held loose
const diavolo = `
  ${shape("M110 134C96 112 72 106 46 114C58 120 60 128 56 136C68 132 76 136 80 144C90 136 100 138 110 150C120 138 130 136 140 144C144 136 152 132 164 136C160 128 162 120 174 114C148 106 124 112 110 134Z", M)}
  ${shape("M100 126Q96 112 102 104Q102 116 106 124Z", G)}${shape("M120 126Q124 112 118 104Q118 116 114 124Z", G)}
  ${dot(110, 132, 3.4)}
  ${shape("M78 232H142V284H78Z", NM, `stroke="${C}" stroke-width="1"`)}${line("M78 244H142", C, 0.8)}
  ${ring(110, 262, 5, G, 1.8)}
  ${chain(106, 266, 64, 300, 7)}${chain(114, 266, 156, 300, 7)}
  ${shape("M40 300H180V320H40Z", N)}
  ${[[60, 196], [160, 186], [74, 170], [146, 214]].map(([x, y]) => dot(x, y, 1.8)).join("")}
  ${line("M128 232L152 170", C, 2)}${shape("M148 172Q156 158 152 148Q162 160 156 174Z", G)}
`;

// XVI · La Torre: the tower struck by lightning, its crown thrown off, falling sparks
const torre = `
  ${shape("M60 76L96 118L84 122L108 150L78 128L90 124Z", G)}
  ${shape("M88 156H132V320H88Z", NM, `stroke="${C}" stroke-width="1.2"`)}
  ${shape("M88 156L94 148L100 158L106 146L114 158L120 150L126 158L132 150V160H88Z", NM, `stroke="${C}" stroke-width="1.2"`)}
  ${line("M88 190H132M88 226H132M88 262H132M88 298H132M110 156V190M100 190V226M120 190V226M110 226V262M100 262V298M120 262V298", C, 0.6)}
  ${[[110, 208], [98, 244], [122, 244], [110, 282]].map(([x, y]) => `<path d="M${x - 5} ${y + 8}V${y}a5 5 0 0 1 10 0V${y + 8}Z" fill="${G}"/>`).join("")}
  <g transform="translate(150 128) rotate(28)">${shape("M-14 8L-12 -6L-5 2L0 -9L5 2L12 -6L14 8Z", G)}</g>
  ${[[64, 170], [72, 214], [154, 176], [148, 222], [60, 250], [160, 262], [70, 290], [150, 296]].map(([x, y]) => shape(`M${x} ${y - 5}Q${x + 3} ${y} ${x} ${y + 3}Q${x - 3} ${y} ${x} ${y - 5}Z`, G)).join("")}
  ${shape("M40 308L64 300L88 312V320H40Z", NM)}${shape("M132 312L160 298L180 306V320H132Z", NM)}
`;

// XVIII · La Luna: the moon between two towers, dew falling, the path from the pool
const luna = `
  <circle cx="110" cy="118" r="24" fill="${C}" opacity=".25"/>
  <mask id="luna-cut"><rect x="40" y="70" width="140" height="80" fill="#fff"/><circle cx="121" cy="112" r="20" fill="#000"/></mask>
  <circle cx="110" cy="118" r="24" fill="${G}" mask="url(#luna-cut)"/>
  ${[[82, 160], [110, 164], [138, 160], [96, 180], [124, 180]].map(([x, y]) => shape(`M${x} ${y - 5}Q${x + 3} ${y} ${x} ${y + 3}Q${x - 3} ${y} ${x} ${y - 5}Z`, G)).join("")}
  ${[[46, 64], [156, 174]].map(([a, b]) => `${shape(`M${a} 208H${b}V286H${a}Z`, NM, `stroke="${C}" stroke-width="1"`)}${shape(`M${a} 208V200H${a + 5}V206H${a + 9}V200H${a + 13}V206H${b}V200`, "none", `stroke="${C}" stroke-width="1"`)}${shape(`M${(a + b) / 2 - 3} 236V230a3 3 0 0 1 6 0V236Z`, G)}`).join("")}
  ${hill(270, GR)}
  ${line("M110 292C94 280 126 268 110 256C100 248 118 240 110 230", C, 1.2)}
  ${shape("M40 290Q110 280 180 290V320H40Z", V)}${waves(298, 2)}
  ${shape("M104 310Q110 300 116 310Q110 306 104 310Z", M)}
`;

// XX · Il Giudizio: the trumpet from the clouds, its banner, three arches opening
const giudizio = `
  ${cloud(84, 104, 1.1)}${cloud(126, 98, 1.3)}${cloud(150, 116, 0.9)}
  ${Array.from({ length: 7 }, (_, i) => `<path d="M110 118V132" stroke="${G}" stroke-width="1" transform="rotate(${-54 + i * 18} 110 104)"/>`).join("")}
  ${line("M132 124L92 176", G, 3)}${shape("M92 176L78 180L88 166Z", G)}
  ${shape("M114 148H136V166H114Z", C)}${line("M125 150V164M117 157H133", M, 2)}
  ${hill(270, NM)}
  ${[66, 110, 154].map((x) => `${shape(`M${x - 14} 300V272a14 14 0 0 1 28 0V300Z`, G, 'opacity=".9"')}${shape(`M${x - 14} 300V272a14 14 0 0 1 28 0V300Z`, "none", `stroke="${C}" stroke-width="1.4"`)}${sparkle(x, 262, 4, C)}`).join("")}
  ${shape("M40 300H180V320H40Z", V)}
`;

// XXI · Il Mondo: the laurel wreath with its ribbons, a star at its heart, the four corners
const mondo = `
  ${Array.from({ length: 34 }, (_, i) => {
    const t = (i / 34) * Math.PI * 2;
    const x = 110 + 40 * Math.cos(t), y = 200 + 62 * Math.sin(t);
    const deg = (Math.atan2(62 * Math.cos(t), -40 * Math.sin(t)) * 180) / Math.PI + (i % 2 ? 28 : -28);
    return leaf(+x.toFixed(1), +y.toFixed(1), 12, +deg.toFixed(1), i % 3 === 0 ? GRL : GR);
  }).join("")}
  ${shape("M100 130L110 138L120 130L116 144L110 140L104 144Z", M)}${shape("M100 270L110 262L120 270L116 256L110 260L104 256Z", M)}
  ${sparkle(110, 200, 22, G)}${sparkle(110, 200, 9, C)}
  ${([[62, 116, C], [158, 116, G], [62, 296, T], [158, 296, P]] as const).map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>${sparkle(x, y, 4, N)}`).join("")}
`;

export const art: Record<number, string> = {
  1: bagatto, 2: papessa, 3: imperatrice, 4: imperatore, 5: papa, 6: amanti, 7: carro,
  8: giustizia, 9: eremita, 10: ruota, 11: forza, 12: appeso, 13: morte, 14: temperanza,
  15: diavolo, 16: torre, 18: luna, 20: giudizio, 21: mondo,
};
