import { useState, useEffect, useRef, useMemo } from 'react'
import meltyStudio1 from './assets/meltystudio1.jpeg'
import './App.css'

/* ── Scroll-in animation hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── CSS candle component ── */
function Candle({ color = '#E8875A', floatDelay = '0s', scale = 1 }) {
  return (
    <div className="candle-float" style={{ animationDelay: floatDelay }}>
      <div className="candle-outer" style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
        <div className="candle-glow" />
        <div className="candle-flame" />
        <div className="candle-wick" />
        <div className="candle-body" style={{ backgroundColor: color }}>
          <div className="candle-drip" style={{ backgroundColor: color }} />
        </div>
        <div className="candle-base" />
      </div>
    </div>
  )
}

/* ── FAQ item ── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' faq-open' : ''}`}>
      <button
        className="faq-question"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-answer" aria-hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

/* ── Workshop card ── */
function WorkshopCard({ title, date, duration, price, description, spots, accentColor }) {
  return (
    <div className="workshop-card" style={{ '--card-accent': accentColor }}>
      <div className="workshop-badge">{spots} plekken vrij</div>
      <div className="workshop-emoji">🕯️</div>
      <h3>{title}</h3>
      <p className="workshop-desc">{description}</p>
      <div className="workshop-meta">
        <span>📅 {date}</span>
        <span>⏱ {duration}</span>
        <span>💰 vanaf €{price}</span>
      </div>
      <button className="btn-workshop">Inschrijven →</button>
    </div>
  )
}

/* ── Product card ── */
function ProductCard({ name, price, scent, bgColor, emoji, floatDelay = '0s' }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className="product-card">
      <div className="product-img" style={{ backgroundColor: bgColor }}>
        <span className="product-emoji" style={{ animationDelay: floatDelay }}>{emoji}</span>
        <button
          className={`like-btn${liked ? ' liked' : ''}`}
          onClick={() => setLiked(v => !v)}
          aria-label={liked ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p className="scent">{scent}</p>
        <div className="product-footer">
          <span className="price">€{price}</span>
          <button className="btn btn-cart">In winkelwagen</button>
        </div>
      </div>
    </div>
  )
}

/* ── Sparkles (memoised so positions don't shift on re-render) ── */
function Sparkles() {
  const items = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${(i * 47 + 13) % 100}%`,
      top:  `${(i * 31 + 7)  % 100}%`,
      delay: `${(i * 0.37) % 4}s`,
      duration: `${2.5 + (i * 0.23) % 2.5}s`,
    }))
  , [])

  return (
    <div className="sparkles" aria-hidden="true">
      {items.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  )
}

/* ════════════════════════════
   Main App
   ════════════════════════════ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const [heroRef,       heroInView]       = useInView(0.05)
  const [aboutRef,      aboutInView]      = useInView(0.1)
  const [workshopsRef,  workshopsInView]  = useInView(0.05)
  const [shopRef,       shopInView]       = useInView(0.05)
  const [faqRef,        faqInView]        = useInView(0.05)
  const [newsletterRef, newsletterInView] = useInView(0.1)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const workshops = [
    {
      title: 'Soja Kaarsen Basis',
      date: '3 mei 2026',
      duration: '2,5 uur',
      price: '55',
      description: 'Maak je eigen soja kaarsen met de geur van jouw keuze. Perfect voor beginners!',
      spots: 6,
      accentColor: '#F5C842',
    },
    {
      title: 'Botanische Kaarsen',
      date: '17 mei 2026',
      duration: '3 uur',
      price: '65',
      description: 'Leer bloemen en kruiden in kaarsen verwerken voor een magisch, sfeervol resultaat.',
      spots: 4,
      accentColor: '#C8A2C8',
    },
    {
      title: 'Seizoenskaarsen',
      date: '7 juni 2026',
      duration: '3 uur',
      price: '70',
      description: 'Maak kaarsen geïnspireerd op de seizoenen, met unieke kleuren en geuren.',
      spots: 8,
      accentColor: '#A8C5A0',
    },
  ]

  const products = [
    { name: 'Zomerbries',     price: '18,50', scent: 'Citroen & Lavendel',   bgColor: '#E8F4FD', emoji: '🌿', floatDelay: '0s' },
    { name: 'Vanilla Dream',  price: '18,50', scent: 'Vanille & Amber',       bgColor: '#FFF3E0', emoji: '✨', floatDelay: '0.4s' },
    { name: 'Roze Pioen',     price: '22,00', scent: 'Roos & Witte Musk',    bgColor: '#FCE4EC', emoji: '🌸', floatDelay: '0.8s' },
    { name: 'Wilde Honing',   price: '20,00', scent: 'Honing & Eucalyptus',  bgColor: '#FFF9C4', emoji: '🍯', floatDelay: '0.2s' },
    { name: 'Oceaan Rust',    price: '18,50', scent: 'Zeezout & Munt',       bgColor: '#E0F2F1', emoji: '🌊', floatDelay: '0.6s' },
    { name: 'Gezellig Thuis', price: '24,00', scent: 'Kaneel & Sinaasappel', bgColor: '#FBE9E7', emoji: '🏡', floatDelay: '1.0s' },
  ]

  const faqs = [
    {
      question: 'Zijn jullie kaarsen geschikt voor mensen met gevoeligheid voor geuren?',
      answer: 'Onze kaarsen zijn gemaakt van 100% soja was en bevatten geen synthetische parfums. We gebruiken uitsluitend zuivere etherische oliën. Bij ernstige geurovergevoeligheid raden we aan om eerst een kleine kaars te proberen of contact met ons op te nemen.',
    },
    {
      question: 'Hoe lang brandt een Melty Studio kaars gemiddeld?',
      answer: 'Onze standaard kaarsen (200 ml) branden gemiddeld 40–50 uur bij correct gebruik. Tip: laat de was de eerste keer volledig vloeibaar worden om een gelijkmatig oppervlak te behouden.',
    },
    {
      question: 'Kan ik mijn eigen geur kiezen bij een workshop?',
      answer: 'Ja! Tijdens onze workshops kun je kiezen uit meer dan 30 etherische oliën en geurblendes. Onze workshopleider helpt je de perfecte combinatie te maken voor jouw kaars.',
    },
    {
      question: 'Verzenden jullie ook naar buiten Nederland?',
      answer: 'We verzenden momenteel naar heel Nederland en België. Voor andere landen — stuur ons een berichtje via het contactformulier en we kijken wat er mogelijk is.',
    },
    {
      question: 'Hoe snel ontvang ik mijn bestelling?',
      answer: 'Bestellingen geplaatst vóór 14:00 op werkdagen worden dezelfde dag verzonden en zijn doorgaans binnen 1–3 werkdagen bij jou thuis.',
    },
    {
      question: 'Zijn de workshops geschikt voor kinderen?',
      answer: 'Onze workshops zijn bedoeld voor deelnemers van 16 jaar en ouder vanwege het werken met hete was. Voor verjaardagsfeestjes of speciale gelegenheden met jongeren kunnen we een aangepast programma aanbieden — neem contact op voor meer informatie.',
    },
  ]

  function handleNewsletterSubmit(e) {
    e.preventDefault()
    setEmailSent(true)
  }

  return (
    <div className="app">
      <Sparkles />

      {/* ── Navbar ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Hoofdnavigatie">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav-flame" aria-hidden="true">🕯️</span>
          <span>Melty Studio</span>
        </div>

        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          <a href="#about"     onClick={() => setMenuOpen(false)}>Over ons</a>
          <a href="#workshops" onClick={() => setMenuOpen(false)}>Workshops</a>
          <a href="#shop"      onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#faq"       onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#contact"   onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="#shop" className="btn btn-nav" onClick={() => setMenuOpen(false)}>Winkel</a>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className={`hero-content${heroInView ? ' visible' : ''}`} ref={heroRef}>
          <div className="hero-img-wrapper">
            <img src={meltyStudio1} alt="Melty Studio handgemaakte kaarsen" className="hero-img" />
          </div>

          <div className="hero-text">
            <span className="hero-badge">✨ Handgemaakt met liefde</span>
            <h1>
              Verlicht jouw wereld met{' '}
              <em>Melty Studio</em>
            </h1>
            <p>
              Ambachtelijke soja kaarsen en inspirerende workshops —
              voor een gezellig thuis en een creatieve middag vol warmte.
            </p>
            <div className="hero-cta">
              <a href="#shop"      className="btn btn-primary">Ontdek de shop</a>
              <a href="#workshops" className="btn btn-secondary">Workshops bekijken</a>
            </div>
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFF8F0" />
          </svg>
        </div>
      </section>

      {/* ── About ── */}
      <section className="about" id="about">
        <div className={`about-content${aboutInView ? ' visible' : ''}`} ref={aboutRef}>
          <div className="about-text">
            <span className="section-badge">Over ons</span>
            <h2>Gemaakt met passie, gebrand voor jou</h2>
            <p>
              Bij Melty Studio geloven we dat een goed brandende kaars een kamer
              kan transformeren. Elk kaarsje wordt met de hand gegoten van 100%
              soja was, verrijkt met de mooiste etherische oliën en botanische
              ingrediënten.
            </p>
            <p>
              Ons atelier bruist van creativiteit — en die creativiteit delen we
              graag met jou tijdens onze gezellige, kleine workshops.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-num">500+</span>
                <span>blije klanten</span>
              </div>
              <div className="stat">
                <span className="stat-num">30+</span>
                <span>geuren</span>
              </div>
              <div className="stat">
                <span className="stat-num">100%</span>
                <span>soja was</span>
              </div>
            </div>
          </div>

          <div className="about-visual" aria-hidden="true">
            <div className="about-bubble bubble-1">🕯️</div>
            <div className="about-bubble bubble-2">🌸</div>
            <div className="about-bubble bubble-3">✨</div>
            <div className="about-bubble bubble-4">🌿</div>
            <div className="about-main-img">
              <div className="candle-display">
                <Candle color="#E8875A" floatDelay="0s"   scale={1.4} />
                <Candle color="#C8A2C8" floatDelay="0.6s" scale={1.9} />
                <Candle color="#F5C842" floatDelay="1.2s" scale={1.2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wave ── */}
      <div className="wave-divider wave-peach" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#FFF0E8" />
        </svg>
      </div>

      {/* ── Workshops ── */}
      <section className="workshops" id="workshops">
        <div className={`section-content${workshopsInView ? ' visible' : ''}`} ref={workshopsRef}>
          <div className="section-header">
            <span className="section-badge">Workshops</span>
            <h2>Maak je eigen kaarsjes</h2>
            <p>
              Kom een middag creatief zijn in ons gezellige atelier.
              Voor beginners én gevorderden!
            </p>
          </div>

          <div className="workshops-grid">
            {workshops.map((w, i) => (
              <WorkshopCard key={i} {...w} />
            ))}
          </div>

          <div className="workshops-cta">
            <p>Op zoek naar een privé workshop of teambuilding?</p>
            <a href="#contact" className="btn btn-outline">Neem contact op</a>
          </div>
        </div>
      </section>

      {/* ── Wave ── */}
      <div className="wave-divider wave-cream" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,0 960,60 1440,30 L1440,60 L0,60 Z" fill="#FFF8F0" />
        </svg>
      </div>

      {/* ── Shop ── */}
      <section className="shop" id="shop">
        <div className={`section-content${shopInView ? ' visible' : ''}`} ref={shopRef}>
          <div className="section-header">
            <span className="section-badge">Shop</span>
            <h2>Onze collectie</h2>
            <p>Handgegoten soja kaarsen — elk kaarsje een uniek verhaal.</p>
          </div>

          <div className="products-grid">
            {products.map((p, i) => (
              <ProductCard key={i} {...p} />
            ))}
          </div>

          <div className="shop-cta">
            <a href="#" className="btn btn-primary">Bekijk alle producten</a>
          </div>
        </div>
      </section>

      {/* ── Wave ── */}
      <div className="wave-divider wave-cream" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#FFF8F0" />
        </svg>
      </div>

      {/* ── FAQ ── */}
      <section className="faq" id="faq">
        <div className={`section-content${faqInView ? ' visible' : ''}`} ref={faqRef}>
          <div className="section-header">
            <span className="section-badge">FAQ</span>
            <h2>Veelgestelde vragen</h2>
            <p>Alles wat je wil weten over onze kaarsen, workshops en bezorging.</p>
          </div>

          <div className="faq-list">
            {faqs.map((f, i) => (
              <FaqItem key={i} question={f.question} answer={f.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter" id="contact">
        <div className={`newsletter-content${newsletterInView ? ' visible' : ''}`} ref={newsletterRef}>
          <span className="newsletter-emoji" aria-hidden="true">💌</span>
          <h2>Blijf op de hoogte</h2>
          <p className="newsletter-sub">
            Ontvang als eerste nieuws over nieuwe geuren, workshops en
            exclusieve aanbiedingen.
          </p>

          {emailSent ? (
            <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
              🎉 Bedankt! Je bent aangemeld.
            </p>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="jouw@email.nl"
                required
                aria-label="E-mailadres"
              />
              <button type="submit" className="newsletter-submit">
                Aanmelden ✨
              </button>
            </form>
          )}

          <p className="newsletter-note">Geen spam. Uitschrijven kan altijd.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-brand-name">
              <span aria-hidden="true">🕯️</span> Melty Studio
            </div>
            <p>Handgemaakte kaarsen vol liefde, gemaakt in ons eigen atelier.</p>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Navigatie</span>
            <a href="#about">Over ons</a>
            <a href="#workshops">Workshops</a>
            <a href="#shop">Shop</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Volg ons</span>
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Facebook</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Info</span>
            <a href="#">Verzending &amp; retour</a>
            <a href="#">Privacybeleid</a>
            <a href="#">Algemene voorwaarden</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Melty Studio — Gemaakt met ♥ in Nederland</p>
        </div>
      </footer>
    </div>
  )
}
