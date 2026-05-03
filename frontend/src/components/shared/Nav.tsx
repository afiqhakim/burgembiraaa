'use client'
// ─────────────────────────────────────────────────────────────
// Nav — placeholder only. Friend's nav design will replace this.
// ─────────────────────────────────────────────────────────────
import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <span className={styles.brandTop}>Burger</span>
        <span className={styles.brandBottom}>Embiraaa</span>
      </div>

      <div className={styles.right}>
        <Link href="/menu" className={styles.orderBtn}>Order Now</Link>
        <button className={styles.menuBtn} aria-label="Menu">
          <span /><span />
        </button>
      </div>
    </nav>
  )
}
