# Festival dei Tarocchi: landing page

Landing page per il Festival dei Tarocchi (Milano, Fabbrica del Vapore), ideato da Écate Studio. Obiettivo di qualità: livello Awwwards, con identità propria, non un template.

## Leggi prima di lavorare
- `brief.md`: progetto, pubblico, identità visiva, struttura, punti aperti
- `contenuto/festival-dei-tarocchi.txt`: fonte unica dei contenuti
- `design/moodboard.jpg` e `design/presentazione-infografica.jpg`: guardale davvero, sono la direzione visiva
- `riferimenti.md`: siti di riferimento e cosa prendere da ciascuno
- `assets/`: logo, font, immagini quando disponibili

## Stack
- Astro (pagina singola) + GSAP con ScrollTrigger + Lenis per lo smooth scroll. Se nel piano proponi altro, motivalo.
- CSS custom con variabili per colori, spaziature, tipografia e durate di animazione. Niente librerie UI generiche, niente Tailwind di default.
- Immagini in AVIF o WebP, con dimensioni esplicite, lazy loading sotto la piega.

## Lingua e copy
- Italiano. Nome sempre "Festival dei Tarocchi". Payoff: "Arte, cultura, simbolo, immaginario".
- Target: partner, sponsor e istituzioni culturali. CTA principale: richiedere il masterplan o un incontro. Nessuna vendita di biglietti.
- Date e numero di Dimore della prima edizione non sono definiti: non scriverli, non stimarli. Usa "un numero selezionato di Dimore" e "date in arrivo".
- Il copy viene da `contenuto/`. Puoi accorciarlo e adattarlo al web, non inventare fatti, numeri o nomi.
- Ogni dato mancante diventa un segnaposto visibile, ad esempio `[DATE DA CONFERMARE]`, e lo elenchi nel riepilogo finale.
- Mai il trattino lungo (—). Niente frasi generiche da presentazione aziendale o da testo scritto da IA. Frasi concrete, tono colto e caldo.

## Fedeltà visiva (regola prioritaria)
- `design/moodboard.jpg` e `design/presentazione-infografica.jpg` sono l'autorità sul look. Palette, tipografia, illustrazioni, carta strappata, sole, luna, archi e atmosfera vengono da lì.
- I siti in `riferimenti.md` valgono solo per struttura e comportamenti (scroll, transizioni, ritmo), mai per l'aspetto. Non importare fondi neri, stile punk, techno o fotografia da concerto.
- Non sostituire gli elementi grafici con forme generiche. Se serve un'illustrazione che non c'è, segnalalo con un segnaposto e descrivi cosa serve, invece di improvvisare uno stile diverso.
- Dopo ogni sezione confronta lo screenshot con le due immagini e scrivi in due righe cosa corrisponde e cosa si discosta. Correggi prima di chiedere il mio ok.

## Design
- Le variabili colore stanno in un solo file e seguono la palette del brief. Non introdurre colori fuori palette senza dirlo.
- Forma guida: l'arco. Elementi ricorrenti: sole, luna, stelle, carta strappata, texture analogiche.
- Ritmo alternato: sezioni dense e sezioni con molto spazio.
- Ogni animazione ha uno scopo narrativo. Meglio poche curate che tante casuali.
- Mobile è un design a sé, non una versione ridotta. Testare a 390 px e 1440 px.

## Qualità obbligatoria
- Rispettare `prefers-reduced-motion` (versione statica e completa dei contenuti).
- Contrasto AA, focus visibile, HTML semantico, un solo h1, alt sulle immagini.
- Lighthouse performance sopra 90 su mobile. Niente layout shift.
- Nessun contenuto essenziale che dipende dal JavaScript per essere leggibile.

## Metodo di lavoro
1. Lavora una sezione alla volta e non passare alla successiva senza il mio ok.
2. Dopo ogni sezione apri il server locale, fai screenshot desktop e mobile, guardali e correggi da solo quello che non regge.
3. Commit piccoli, con messaggi chiari.
4. Se una scelta di design è ambigua, proponi due opzioni brevi invece di scegliere in silenzio.
