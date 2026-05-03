'use client'
import { useEffect, useRef, useState } from 'react'
import Nav from '@/components/shared/Nav'
import styles from './story.module.css'

// ─── PHOTO DATA ───────────────────────────────────────────────
// Replace `src: null` with your actual image paths e.g. '/photos/masfest.jpg'
// Replace `label` with your event name + date
const PHOTOS = [
  { id: 1,  label: 'MasFest, Feb \'25',                        src: null, size: 'lg',   offset: 'hi' },
  { id: 2,  label: 'Ramadhan Project × Red Tiger, Mar \'25',   src: null, size: 'md',   offset: 'lo' },
  { id: 3,  label: '98 Tiny Desk, Apr \'25',                   src: null, size: 'tall', offset: 'up' },
  { id: 4,  label: 'Add your label here',                      src: null, size: 'sq',   offset: 'dn' },
  { id: 5,  label: 'Add your label here',                      src: null, size: 'wd',   offset: 'up' },
  { id: 6,  label: 'Add your label here',                      src: null, size: 'lg',   offset: 'hi' },
  { id: 7,  label: 'Add your label here',                      src: null, size: 'sm',   offset: 'lo' },
  { id: 8,  label: 'Add your label here',                      src: null, size: 'md',   offset: 'dn' },
  { id: 9,  label: 'Add your label here',                      src: null, size: 'tall', offset: 'up' },
  { id: 10, label: 'Add your label here',                      src: null, size: 'sq',   offset: 'lo' },
]

// ─── SENTENCES ────────────────────────────────────────────────
// Replace these with your actual sentences
const SENTENCES = [
  'Three men with a dream bigger than ourselves.',
  'For the people, by the people.',
  'Travelled the world for the perfect recipe.',
]

export default function StoryPage() {
  const trackRef   = useRef<HTMLDivElement>(null)
  const [curX, setCurX]     = useState(0)
  const [tgtX, setTgtX]     = useState(0)
  const [progress, setProgress] = useState(0)
  const [slideNum, setSlideNum] = useState(1)
  const [hintGone, setHintGone] = useState(false)
  const animRef    = useRef<number>()
  const curXRef    = useRef(0)
  const tgtXRef    = useRef(0)

  const totalSlides = 10

  useEffect(() => {
    function maxScroll() {
      if (!trackRef.current) return 0
      return trackRef.current.scrollWidth - innerWidth
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      tgtXRef.current = Math.max(0, Math.min(tgtXRef.current + e.deltaY * 1.6, maxScroll()))
      setHintGone(true)
    }

    let tsy = 0
    const onTouchStart = (e: TouchEvent) => { tsy = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      const dy = tsy - e.touches[0].clientY
      tsy = e.touches[0].clientY
      tgtXRef.current = Math.max(0, Math.min(tgtXRef.current + dy * 2.2, maxScroll()))
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    const loop = () => {
      curXRef.current += (tgtXRef.current - curXRef.current) * 0.07
      if (Math.abs(tgtXRef.current - curXRef.current) < 0.05) {
        curXRef.current = tgtXRef.current
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-curXRef.current}px)`
      }
      const ms = maxScroll()
      setProgress(ms > 0 ? (curXRef.current / ms) * 100 : 0)

      // Slide counter
      const slides = document.querySelectorAll('[data-slide]')
      let active = 1
      slides.forEach(s => {
        if (s.getBoundingClientRect().left < innerWidth * 0.55) {
          active = parseInt((s as HTMLElement).dataset.slide || '1')
        }
      })
      setSlideNum(active)

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <main className={styles.main}>
      {/* BG contour lines */}
      <svg className={styles.bgSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="rgba(15,12,8,0.055)" strokeWidth="1">
          <ellipse cx="720" cy="450" rx="300" ry="238"/>
          <ellipse cx="720" cy="450" rx="420" ry="338"/>
          <ellipse cx="720" cy="450" rx="542" ry="442"/>
          <ellipse cx="195" cy="635" rx="185" ry="144" transform="rotate(-18,195,635)"/>
          <ellipse cx="195" cy="635" rx="255" ry="198" transform="rotate(-18,195,635)"/>
          <ellipse cx="1285" cy="252" rx="165" ry="126" transform="rotate(22,1285,252)"/>
          <ellipse cx="1285" cy="252" rx="235" ry="180" transform="rotate(22,1285,252)"/>
          <ellipse cx="295" cy="574" rx="136" ry="104" transform="rotate(-10,295,574)" fill="rgba(200,121,26,0.025)" stroke="none"/>
        </g>
      </svg>

      <Nav />

      {/* Progress bar */}
      <div className={styles.progress} style={{ width: `${progress}%` }} />

      {/* Counter */}
      <div className={styles.counter}>
        <span className={styles.counterNum}>{slideNum}</span>
        <span className={styles.counterSep}> / </span>
        <span className={styles.counterTotal}>{totalSlides}</span>
      </div>

      {/* Side label */}
      <p className={styles.sideLabel}>Our Story · Burgembiraaa</p>

      {/* Scroll hint */}
      {!hintGone && (
        <div className={styles.hint}>
          <span>Scroll to explore</span>
          <svg width="30" viewBox="0 0 40 12" fill="none">
            <path d="M0 6h37M32 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        </div>
      )}

      {/* ── HORIZONTAL TRACK ── */}
      <div className={styles.trackWrap}>
        <div ref={trackRef} className={styles.track}>

          {/* Opening */}
          <div className={styles.slideTitle} data-slide="1">
            <p className={styles.eyebrow}>Our Story</p>
            <h1 className={styles.titleHeadline}>
              Our<br /><em>Story.</em>
            </h1>
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          {/* Photos 1–2 + Sentence 1 */}
          <div className={styles.photoGroup} data-slide="2">
            <PhotoCard photo={PHOTOS[0]} />
            <PhotoCard photo={PHOTOS[1]} />
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          <div className={styles.slideSentence} data-slide="3">
            <p className={styles.sentence}>{SENTENCES[0]}</p>
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          {/* Photos 3–4 */}
          <div className={styles.photoGroup} data-slide="4">
            <PhotoCard photo={PHOTOS[2]} />
            <PhotoCard photo={PHOTOS[3]} />
          </div>

          {/* SPACER */}
          <div className={styles.spacerLg} />

          {/* Photo 5 alone — breathing room */}
          <div className={styles.photoGroup} data-slide="5">
            <PhotoCard photo={PHOTOS[4]} />
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          <div className={styles.slideSentence} data-slide="6">
            <p className={styles.sentence}>{SENTENCES[1]}</p>
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          {/* Photos 6–7 */}
          <div className={styles.photoGroup} data-slide="7">
            <PhotoCard photo={PHOTOS[5]} />
            <PhotoCard photo={PHOTOS[6]} />
          </div>

          {/* SPACER */}
          <div className={styles.spacerLg} />

          {/* Photos 8–9 */}
          <div className={styles.photoGroup} data-slide="8">
            <PhotoCard photo={PHOTOS[7]} />
            <PhotoCard photo={PHOTOS[8]} />
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          <div className={styles.slideSentence} data-slide="9">
            <p className={styles.sentence}>{SENTENCES[2]}</p>
          </div>

          {/* SPACER */}
          <div className={styles.spacer} />

          {/* Photo 10 — last before end */}
          <div className={styles.photoGroup} data-slide="10">
            <PhotoCard photo={PHOTOS[9]} />
          </div>

          {/* SPACER */}
          <div className={styles.spacerLg} />

          {/* End */}
          <div className={styles.slideEnd}>
            <h2 className={styles.endHeadline}>Burgembiraaa<br />Untuk Semua.</h2>
            <a href="/menu" className={styles.endBtn}>
              <span>View The Menu →</span>
            </a>
          </div>

          {/* Trailing space */}
          <div style={{ width: '12vw', flexShrink: 0 }} />
        </div>
      </div>
    </main>
  )
}

// ─── PHOTO CARD COMPONENT ─────────────────────────────────────
function PhotoCard({ photo }: { photo: typeof PHOTOS[0] }) {
  return (
    <div className={`${styles.photoCard} ${styles[photo.offset]}`}>
      <p className={styles.photoLabel}>{photo.label}</p>
      <div className={`${styles.photoFrame} ${styles[photo.size]}`}>
        {photo.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.label} />
        ) : (
          <PlaceholderArt label={photo.label} />
        )}
      </div>
    </div>
  )
}

// Placeholder until real photos are added
function PlaceholderArt({ label }: { label: string }) {
  return (
    <div className={styles.placeholder}>
      <span className={styles.placeholderText}>Your Photo Here</span>
      <span className={styles.placeholderSub}>{label}</span>
    </div>
  )
}
