# Build Report — Taak #2: Kaarsjes favicon

## 1. Samenvatting

De bestaande favicon (`public/favicon.svg`) is vervangen door een handgetekende kaars in pure SVG.

De vorige favicon was het generieke Claude Code / Anthropic bliksemschicht-icoon (paars, #863bff). De nieuwe favicon toont een sfeervol kaarspictogram dat naadloos aansluit op de Melty Studio huisstijl:

- **Vlam** — radiaal/lineair verloop van wit-geel (#FFFDE7) naar diep oranje (#FF6F00), met een zachte gloed-ellips erachter.
- **Pit** — donkerbruin rechthoekje (#4A3728) onder de vlam.
- **Wasdruppel** — subtiele drip-stroke links op het kaarsenlichaam.
- **Kaarsenlichaam** — warm oranje verloop (#D4734A → #F09A70 → #C8633A), met een witte glans-overlay voor diepte.
- **Sokkel/base** — afgeronde rechthoek in iets donkerder oranje, met glans-highlight.

Alle kleuren sluiten aan op de brandkleuren die al in `App.jsx` en `App.css` worden gebruikt (`#E8875A`, `#F5C842`). Er zijn geen externe bibliotheken, frameworks of afbeeldingsbestanden gebruikt — puur SVG met ingebedde `<linearGradient>` en `<radialGradient>` definities.

Het favicon wordt geladen via de bestaande `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` in `index.html`; die regel hoefde **niet** gewijzigd te worden.

---

## 2. Gewijzigde en aangemaakte bestanden

| Actie      | Pad                       | Omschrijving                                       |
|------------|---------------------------|----------------------------------------------------|
| Gewijzigd  | `public/favicon.svg`      | Vervangen door SVG-kaarsicoon (pure SVG, geen PNG) |
| Gewijzigd  | `build-report.md`         | Dit rapport (bijgewerkt voor taak #2)              |

Geen andere bestanden zijn aangeraakt.
