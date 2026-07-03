import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import kawaiiBeár from './assets/kawaii_bear_face_oval.svg'
import logoMelty from './assets/logoMelty.png'
import meltyStudio1  from './assets/meltystudio1.jpeg'
import meltyStudio2  from './assets/meltystudio2.jpeg'
import meltyStudio3  from './assets/meltystudio3.jpeg'
import meltyStudio4  from './assets/meltystudio4.jpeg'
import meltyStudio6  from './assets/meltystudio6.jpeg'
import meltyStudio7  from './assets/meltystudio7.jpeg'
import meltyStudio8  from './assets/meltystudio8.jpeg'
import meltyStudio9  from './assets/meltystudio9.jpeg'
import meltyStudio10 from './assets/meltystudio10.jpeg'
import meltyStudio11 from './assets/meltystudio11.jpeg'
import meltyStudio12 from './assets/meltystudio12.jpeg'
import meltyStudio13 from './assets/meltystudio13.jpeg'
import meltyStudio14 from './assets/meltystudio14.jpeg'
import meltyStudio15 from './assets/meltystudio15.jpeg'
import meltyStudio16 from './assets/meltystudio16.jpeg'
import meltyStudio17 from './assets/meltystudio17.jpeg'
import meltyStudio18 from './assets/meltystudio18.jpeg'
import meltyStudio19 from './assets/meltystudio19.jpeg'
import meltyStudio20 from './assets/meltystudio20.jpeg'
import studioGif from './assets/meltystudio2video.gif'
import './App.css'

const galleryPhotos = [
  meltyStudio1, meltyStudio4, meltyStudio7, meltyStudio8,
  meltyStudio9, meltyStudio10, meltyStudio11,
  meltyStudio14, meltyStudio15, meltyStudio16,
  meltyStudio17, meltyStudio18, meltyStudio19,
  meltyStudio6, meltyStudio3,
]

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


/* ── Scroll Bear ── */
function ScrollBear() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Bear walks from 5% to 90% down the screen */
  const top = 5 + progress * 85

  return (
    <div className="scroll-bear" style={{ top: `${top}vh` }} aria-hidden="true">
      <div className="bear-body">
        <img src={kawaiiBeár} alt="" className="bear-icon" />
      </div>
      <div className="bear-trail" style={{ height: `${top}vh` }} />
    </div>
  )
}

/* ── Gallery lightbox: morphs from the clicked photo's own position to fullscreen ── */
function GalleryLightbox({ src, alt, originRect, onClose }) {
  const [phase, setPhase] = useState('start') // start -> open -> closing
  const closeTimer = useRef(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase('open'))
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(closeTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClose() {
    setPhase('closing')
    closeTimer.current = setTimeout(onClose, 380)
  }

  let targetH = Math.min(window.innerHeight * 0.85, 700)
  let targetW = targetH * 0.75
  if (targetW > window.innerWidth * 0.9) {
    targetW = window.innerWidth * 0.9
    targetH = targetW / 0.75
  }
  const targetTop = (window.innerHeight - targetH) / 2
  const targetLeft = (window.innerWidth - targetW) / 2

  const frameStyle = phase === 'start'
    ? {
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
        borderRadius: '50%',
        opacity: 1,
      }
    : {
        top: targetTop,
        left: targetLeft,
        width: targetW,
        height: targetH,
        borderRadius: '20px',
        opacity: phase === 'closing' ? 0 : 1,
        transform: phase === 'closing' ? 'scale(0.9)' : 'scale(1)',
      }

  return createPortal(
    <div className={`gallery-lightbox-backdrop${phase === 'open' ? ' visible' : ''}`} onClick={handleClose}>
      <div className="gallery-lightbox-frame" style={frameStyle} onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
      </div>
      <button className="lightbox-close" onClick={handleClose} aria-label="Sluiten">✕</button>
    </div>,
    document.body
  )
}

/* ── Round photo gallery ── */
const INITIAL_COUNT = 8

function PhotoGrid({ photos }) {
  const [showAll, setShowAll] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  function openPhoto(e, src, alt) {
    setLightbox({ src, alt, originRect: e.currentTarget.getBoundingClientRect() })
  }

  return (
    <div className="pol-gallery">
      <div className="pol-grid">
        {photos.map((src, i) => {
          const isExtra = i >= INITIAL_COUNT
          return (
            <div
              key={i}
              className={`pol-card${isExtra && !showAll ? ' pol-hidden' : ''}${isExtra && showAll ? ' pol-extra' : ''}`}
              style={{ '--delay': `${(i - INITIAL_COUNT) * 0.07}s` }}
              onClick={(e) => openPhoto(e, src, `Melty Studio foto ${i + 1}`)}
            >
              <img src={src} alt={`Melty Studio foto ${i + 1}`} />
            </div>
          )
        })}
      </div>

      {!showAll && photos.length > INITIAL_COUNT && (
        <div className="pol-loadmore">
          <button className="btn btn-outline" onClick={() => setShowAll(true)}>
            Meer foto's laden ↓
          </button>
        </div>
      )}

      {lightbox && (
        <GalleryLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          originRect={lightbox.originRect}
          onClose={() => setLightbox(null)}
        />
      )}
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

/* ── Sparkles ── */
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
        <div key={s.id} className="sparkle" style={{
          left: s.left, top: s.top,
          animationDelay: s.delay,
          animationDuration: s.duration,
        }} />
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
  const [galleryRef,    galleryInView]    = useInView(0.05)
  const [workshopsRef,  workshopsInView]  = useInView(0.05)
  const [videoRef,      videoInView]      = useInView(0.05)
  const [shopRef,       shopInView]       = useInView(0.05)
  const [faqRef,        faqInView]        = useInView(0.05)
  const [newsletterRef, newsletterInView] = useInView(0.1)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


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
      <ScrollBear />

      {/* ── Navbar ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Hoofdnavigatie">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoMelty} alt="Melty Studio" className="nav-logo" />
        </div>

        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          <a href="#about"     onClick={() => setMenuOpen(false)}>Over ons</a>
          <a href="#gallery"   onClick={() => setMenuOpen(false)}>Galerij</a>
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
          <div className="hero-photo-side hero-photo-left">
            <div className="hero-photo-frame">
              <img src={meltyStudio1} alt="Melty Studio kaars — verjaardagstaart met kawaii kuiken" />
            </div>
          </div>

          <div className="hero-text-center">
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

            <div className="hero-features">
              <div className="hero-feature">
                <span className="hero-feature-icon">🌿</span>
                <span>100% soja was</span>
              </div>
              <div className="hero-feature">
                <span className="hero-feature-icon">🐻</span>
                <span>Kawaii ontwerp</span>
              </div>
              <div className="hero-feature">
                <span className="hero-feature-icon">🎁</span>
                <span>Cadeau-klaar</span>
              </div>
              <div className="hero-feature">
                <span className="hero-feature-icon">🕯️</span>
                <span>Handgemaakt</span>
              </div>
            </div>
          </div>

          <div className="hero-photo-side hero-photo-right">
            <div className="hero-photo-frame">
              <img src={meltyStudio20} alt="Melty Studio beertjes-kaarsjes in glazen potjes" />
            </div>
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 a60,60 0 0 1 120,0 L1440,120 L0,120 Z" fill="#FFF8F0" />
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
              soja was.
              <br /><br />
              Ons atelier bruist van creativiteit — en die creativiteit delen we
              graag met jou tijdens onze gezellige, kleine workshops.
            </p>
            <div className="about-highlight">
              <span className="about-highlight-icon" aria-hidden="true">🌿</span>
              <div className="about-highlight-text">
                <span className="about-highlight-num">100%</span>
                <span className="about-highlight-label">Soja was</span>
              </div>
              <span className="about-highlight-icon" aria-hidden="true">🌿</span>
            </div>
          </div>

          <div className="about-visual">
            {/* Decoratieve achtergrond blob */}
            <div className="about-blob" />

            {/* Verste achterste foto */}
            <div className="about-photo about-photo-far-back">
              <img src={meltyStudio4} alt="Melty Studio atelier" />
              <span className="about-photo-label">🌿 Ambachtelijk</span>
            </div>

            {/* Middelste foto */}
            <div className="about-photo about-photo-mid">
              <img src={meltyStudio9} alt="Melty Studio kaars" />
              <span className="about-photo-label">🌸 Handgemaakt</span>
            </div>

            {/* Voorste foto — gekanteld rechts */}
            <div className="about-photo about-photo-front">
              <img src={studioGif} alt="Melty Studio in actie" />
              <span className="about-photo-label">🕯️ Made with love by Nga Nguyen</span>
            </div>

            {/* Zwevende bubbels */}
            <div className="about-bubble bubble-1">🌸</div>
            <div className="about-bubble bubble-2">✨</div>
          </div>
        </div>
      </section>

      {/* ── Wave ── */}
      <div className="wave-divider wave-peach" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#FFF0E8" />
        </svg>
      </div>

      {/* ── Gallery ── */}
      <section className="gallery" id="gallery">
        <div className={`section-content${galleryInView ? ' visible' : ''}`} ref={galleryRef}>
          <div className="section-header">
            <span className="section-badge">Galerij</span>
            <h2>Een kijkje in ons atelier</h2>
            <p>Van gieten tot glinsteren — dit is hoe onze kaarsen tot leven komen.</p>
          </div>
          <PhotoGrid photos={galleryPhotos} />
        </div>
      </section>

      {/* ── Wave ── */}
      <div className="wave-divider wave-cream" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,0 960,60 1440,30 L1440,60 L0,60 Z" fill="#FFF8F0" />
        </svg>
      </div>

      {/* ── Workshops ── */}
      <section className="workshops" id="workshops">
        <div className={`section-content${workshopsInView ? ' visible' : ''}`} ref={workshopsRef}>
          <div className="section-header">
            <span className="section-badge">Workshops</span>
            <h2>Maak je eigen kaarsjes</h2>
            <p>Kom een middag creatief zijn in ons gezellige atelier. Voor beginners én gevorderden!</p>
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

      {/* ── Video section ── */}
      <section className="video-section" id="video">
        <div className={`section-content${videoInView ? ' visible' : ''}`} ref={videoRef}>
          <div className="section-header">
            <span className="section-badge">Instagram</span>
            <h2>Volg ons op Instagram</h2>
            <p>
              Bekijk onze laatste posts, sfeerbeelden en verhalen op Instagram.
              Wil je meer van Melty Studio zien? Kom gezellig langs!
            </p>
            <a
              href="https://www.instagram.com/meltystudio.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-instagram"
            >
              <span className="instagram-icon" aria-hidden="true">📸</span>
              Volg @meltystudio.nl
            </a>
          </div>
        </div>
      </section>

      {/* ── Wave ── */}
      <div className="wave-divider wave-peach" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#FFF0E8" />
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
            Ontvang als eerste nieuws over nieuwe geuren, workshops en exclusieve aanbiedingen.
          </p>

          {emailSent ? (
            <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
              🎉 Bedankt! Je bent aangemeld.
            </p>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="jouw@email.nl" required aria-label="E-mailadres" />
              <button type="submit" className="newsletter-submit">Aanmelden ✨</button>
            </form>
          )}

          <p className="newsletter-note">Geen spam. Uitschrijven kan altijd.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoMelty} alt="Melty Studio — handmade candles" className="footer-logo" />
            <p>Handgemaakte kaarsen vol liefde, gemaakt in ons eigen atelier.</p>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Navigatie</span>
            <a href="#about">Over ons</a>
            <a href="#gallery">Galerij</a>
            <a href="#workshops">Workshops</a>
            <a href="#shop">Shop</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Volg ons</span>
            <a href="https://www.instagram.com/meltystudio.nl/" target="_blank" rel="noopener noreferrer">Instagram</a>
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
