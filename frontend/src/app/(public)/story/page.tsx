'use client'

import { useEffect, useRef, useState } from 'react'
import Nav from '@/components/shared/Nav'
import styles from './story.module.css'

const PHOTOS = [
  { id: 1, label: "MasFest, Feb '25", src: '/photos/first_meeting.JPG', size: 'lg', offset: 'hi' },
  { id: 2, label: "Ramadhan Project × Red Tiger, Mar '25", src: '/photos/masfest.JPG', size: 'md', offset: 'lo' },
  { id: 3, label: "98 Tiny Desk, Apr '25", src: '/photos/msnight.JPG', size: 'tall', offset: 'up' },
  { id: 4, label: 'Add your label here', src: '/photos/room_meeting.HEIC', size: 'sq', offset: 'dn' },
  { id: 5, label: 'Add your label here', src: '/photos/red_tiger.HEIC', size: 'wd', offset: 'up' },
  { id: 6, label: 'Add your label here', src: '/photos/ramadhan.JPG', size: 'lg', offset: 'hi' },
  { id: 7, label: 'Add your label here', src: '/photos/kitchenprep.HEIC', size: 'sm', offset: 'lo' },
  { id: 8, label: 'Add your label here', src: '/photos/tinydesk.jpg', size: 'wd', offset: 'dn' },
  { id: 9, label: 'Add your label here', src: '/photos/98hash.JPG', size: 'tall', offset: 'lo' },
  { id: 10, label: 'Add your label here', src: '/photos/last_meeting.HEIC', size: 'sq', offset: 'hi' },
  { id: 11, label: 'Add your label here', src: '/photos/hamburg.JPG', size: 'sq', offset: 'dn' },
  { id: 12, label: 'Add your label here', src: '/photos/graduation.JPG', size: 'sq', offset: 'hi' },
]

const SENTENCES = [
  'Three men with a dream bigger than ourselves.',
  'For the people, by the people.',
  'Travelled the world for the perfect recipe.',
]

export default function StoryPage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [slideNum, setSlideNum] = useState(1)
  const [hintGone, setHintGone] = useState(false)

  const animRef = useRef<number>()
  const curXRef = useRef(0)
  const tgtXRef = useRef(0)

  const totalSlides = 12

  useEffect(() => {
    const maxScroll = () => {
      if (!trackRef.current) return 0
      return Math.max(0, trackRef.current.scrollWidth - window.innerWidth)
    }

    const clamp = (value: number) => {
      tgtXRef.current = Math.max(0, Math.min(value, maxScroll()))
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      const movement = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      clamp(tgtXRef.current + movement * 1.35)
      setHintGone(true)
    }

    let touchY = 0

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      const nextY = e.touches[0].clientY
      const dy = touchY - nextY

      touchY = nextY
      clamp(tgtXRef.current + dy * 2)
      setHintGone(true)
      e.preventDefault()
    }

    const onResize = () => {
      clamp(tgtXRef.current)
    }

    const loop = () => {
      curXRef.current += (tgtXRef.current - curXRef.current) * 0.075

      if (Math.abs(tgtXRef.current - curXRef.current) < 0.08) {
        curXRef.current = tgtXRef.current
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-curXRef.current}px, 0, 0)`
      }

      const maximum = maxScroll()
      setProgress(maximum > 0 ? (curXRef.current / maximum) * 100 : 0)

      const slides = document.querySelectorAll<HTMLElement>('[data-slide]')
      let active = 1

      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect()

        if (rect.left < window.innerWidth * 0.52 && rect.right > window.innerWidth * 0.18) {
          active = Number(slide.dataset.slide || 1)
        }
      })

      setSlideNum(active)

      animRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('resize', onResize)

    animRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)

      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <main className={styles.main}>
      <svg className={styles.bgSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="rgba(15,12,8,0.055)" strokeWidth="1">
          <ellipse cx="720" cy="450" rx="300" ry="238" />
          <ellipse cx="720" cy="450" rx="420" ry="338" />
          <ellipse cx="720" cy="450" rx="542" ry="442" />
          <ellipse cx="195" cy="635" rx="185" ry="144" transform="rotate(-18,195,635)" />
          <ellipse cx="195" cy="635" rx="255" ry="198" transform="rotate(-18,195,635)" />
          <ellipse cx="1285" cy="252" rx="165" ry="126" transform="rotate(22,1285,252)" />
          <ellipse cx="1285" cy="252" rx="235" ry="180" transform="rotate(22,1285,252)" />
          <ellipse
            cx="295"
            cy="574"
            rx="136"
            ry="104"
            transform="rotate(-10,295,574)"
            fill="rgba(200,121,26,0.025)"
            stroke="none"
          />
        </g>
      </svg>

      <Nav />

      <div className={styles.progress} style={{ width: `${progress}%` }} />

      <div className={styles.counter}>
        <span className={styles.counterNum}>{String(slideNum).padStart(2, '0')}</span>
        <span className={styles.counterSep}> / </span>
        <span className={styles.counterTotal}>{String(totalSlides).padStart(2, '0')}</span>
      </div>

      <p className={styles.sideLabel}>Our Story · Burgembiraaa</p>

      {!hintGone && (
        <div className={styles.hint}>
          <span>Scroll to explore</span>
          <svg width="30" viewBox="0 0 40 12" fill="none" aria-hidden="true">
            <path d="M0 6h37M32 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </div>
      )}

      <div className={styles.trackWrap}>
        <div ref={trackRef} className={styles.track}>
          <div className={styles.slideTitle} data-slide="1">
            <p className={styles.eyebrow}>Our Story</p>
            <h1 className={styles.titleHeadline}>
              Our<br /><em>Story.</em>
            </h1>
          </div>

          <div className={styles.spacerLg} />

          <div className={styles.photoGroup} data-slide="2">
            <PhotoCard photo={{ ...PHOTOS[0], size: 'lg', offset: 'hi' }} />
            <PhotoCard photo={{ ...PHOTOS[1], size: 'md', offset: 'lo' }} />
          </div>

          <div className={styles.spacer} />

          <div className={styles.slideSentence} data-slide="3">
            <p className={styles.sentence}>{SENTENCES[0]}</p>
          </div>

          <div className={styles.spacerLg} />

          <div className={styles.photoGroup} data-slide="4">
            <PhotoCard photo={{ ...PHOTOS[2], size: 'tall', offset: 'up' }} />
            <PhotoCard photo={{ ...PHOTOS[3], size: 'sq', offset: 'dn' }} />
          </div>

          <div className={styles.spacer} />

          <div className={styles.photoGroup} data-slide="5">
            <PhotoCard photo={{ ...PHOTOS[4], size: 'wd', offset: 'hi' }} />
          </div>

          <div className={styles.spacerLg} />

          <div className={styles.slideSentence} data-slide="6">
            <p className={styles.sentence}>{SENTENCES[1]}</p>
          </div>

          <div className={styles.spacer} />

          <div className={styles.photoGroup} data-slide="7">
            <PhotoCard photo={{ ...PHOTOS[5], size: 'lg', offset: 'dn' }} />
            <PhotoCard photo={{ ...PHOTOS[6], size: 'sm', offset: 'up' }} />
          </div>

          <div className={styles.spacerLg} />

          <div className={styles.photoGroup} data-slide="8">
            <PhotoCard photo={{ ...PHOTOS[7], size: 'wd', offset: 'lo' }} />
            <PhotoCard photo={{ ...PHOTOS[8], size: 'tall', offset: 'hi' }} />
          </div>

          <div className={styles.spacer} />

          <div className={styles.slideSentence} data-slide="9">
            <p className={styles.sentence}>{SENTENCES[2]}</p>
          </div>

          <div className={styles.spacerLg} />

          <div className={styles.photoGroup} data-slide="10">
            <PhotoCard photo={{ ...PHOTOS[9], size: 'sq', offset: 'up' }} />
            <PhotoCard photo={{ ...PHOTOS[10], size: 'sq', offset: 'dn' }} />
          </div>

          <div className={styles.spacer} />

          <div className={styles.photoGroup} data-slide="11">
            <PhotoCard photo={{ ...PHOTOS[11], size: 'lg', offset: 'hi' }} />
          </div>

          <div className={styles.spacerLg} />

          <div className={styles.slideEnd} data-slide="12">
            <h2 className={styles.endHeadline}>Burgembiraaa<br />Untuk Semua.</h2>
            <a href="/menu" className={styles.endBtn}>
              <span>View The Menu →</span>
            </a>
          </div>

          <div style={{ width: '14vw', flexShrink: 0 }} />
        </div>
      </div>
    </main>
  )
}

function PhotoCard({ photo }: { photo: typeof PHOTOS[0] }) {
  return (
    <div className={`${styles.photoCard} ${styles[photo.offset]}`}>
      <p className={styles.photoLabel}>{photo.label}</p>

      <div className={`${styles.photoFrame} ${styles[photo.size]}`}>
        {photo.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt={photo.label} loading="lazy" />
        ) : (
          <PlaceholderArt label={photo.label} />
        )}
      </div>
    </div>
  )
}

function PlaceholderArt({ label }: { label: string }) {
  return (
    <div className={styles.placeholder}>
      <span className={styles.placeholderText}>Your Photo Here</span>
      <span className={styles.placeholderSub}>{label}</span>
    </div>
  )
}
