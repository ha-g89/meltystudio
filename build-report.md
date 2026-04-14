# Build Report — Taak #3: Footer byline

## 1. Samenvatting

Toegevoegd: "Melty Studio by Nga Nguyen" als byline in de footer van de website.

De tekst verschijnt in `footer-bottom`, direct onder het bestaande copyright-regel
("© 2026 Melty Studio — Gemaakt met ♥ in Nederland"). De byline is gestyled als
een licht-transparante, cursieve regel die past binnen de donkere footer.

## 2. Gewijzigde bestanden

| Actie     | Pad             | Omschrijving                                                                   |
|-----------|-----------------|--------------------------------------------------------------------------------|
| Gewijzigd | `src/App.jsx`   | `footer-bottom` div: extra `<p className="footer-byline">Melty Studio by Nga Nguyen</p>` toegevoegd |
| Gewijzigd | `src/App.css`   | Nieuwe CSS-klasse `.footer-byline` toegevoegd (na `.footer-bottom`): `margin-top`, `color`, `font-size`, `letter-spacing`, `font-style` |
| Gewijzigd | `build-report.md` | Dit bestand bijgewerkt voor taak #3                                          |
