# Melty Studio — Claude Context

## Project
Kaarsenshop voor Nga Nguyen (@meltystudio.nl op Instagram). Single-page marketing + verkoopsite voor handgemaakte soja kaarsen en workshops.

## Tech stack
- **Framework:** Vite + React 19
- **Styling:** Puur CSS (geen UI-library, geen Tailwind)
- **Routing:** Geen — alles één pagina, navigatie via anchor links
- **State:** Lokale React state, geen externe state manager
- **Assets:** Foto's en video's in `src/assets/`

## Bestandsstructuur
```
src/
  App.jsx       — alle componenten + logica (~846 regels)
  App.css       — alle stijlen
  index.css     — globale reset / body
  assets/       — meltystudio1-16.jpeg, 2x mp4-video, logo, SVG's
```

## Secties op de pagina
| Sectie | ID | Status |
|--------|----|--------|
| Navbar (sticky, hamburger mobiel) | — | Compleet |
| Hero (roterende fotostapel, 10s interval) | — | Compleet |
| About (polaroid-foto's + stats) | `#about` | Compleet |
| Galerij (horizontaal drag + lightbox) | `#gallery` | Compleet |
| Workshops (3 kaarten) | `#workshops` | UI klaar, knop doet niets |
| Video / Instagram-link | `#video` | Compleet |
| Shop (6 productkaarten) | `#shop` | UI klaar, geen winkelwagen |
| FAQ (accordion, 6 vragen) | `#faq` | Compleet |
| Newsletter / Contact (e-mail) | `#contact` | Formulier zonder backend |
| Footer | — | Compleet |

## CSS design tokens (`:root`)
```
--cream: #FFF8F0   --peach: #FFF0E8   --coral: #E8875A
--gold: #F5C842    --lilac: #C8A2C8   --sage: #A8C5A0
--pink: #FFAAA5    --text: #3D2B1F    --text-light: #8B6B5B
--radius: 20px     --shadow: 0 8px 32px rgba(61,43,31,0.08)
```

## Componenten
- `Candle` — CSS kaars-animatie
- `HeroStack` — roterende fotostapel (useState + setInterval)
- `ScrollBear` — beer die meebeweegt met scroll (IntersectionObserver)
- `Lightbox` — fullscreen fotoviewer (Escape-toets sluit)
- `PhotoGallery` — horizontale scroll met muisdrag, momentum en dots
- `FaqItem` — accordion item (open/dicht)
- `WorkshopCard` — kaart met datum/prijs/spots
- `ProductCard` — productkaart met like-knop (alleen visueel)
- `Sparkles` — achtergrondanimatie

## Wat er nog niet is (toekomstige features)
- **Winkelwagen** — geen cart state, geen totaal, geen checkout
- **Betaling** — Stripe of Mollie nog niet geïntegreerd
- **Workshop inschrijven** — knop doet niets, geen formulier/backend
- **Newsletter backend** — formulier werkt lokaal, maar verstuurt niets
- **Routing** — geen productpagina's of detailpagina's

## Commands
```bash
npm run dev      # lokale dev server
npm run build    # productie build
npm run preview  # preview van build
npm run lint     # ESLint
```
