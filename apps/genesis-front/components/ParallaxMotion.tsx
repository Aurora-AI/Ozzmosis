"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"

/**
 * ParallaxMotion (client)
 * - Governado: efeito mínimo, determinístico e legível.
 * - Sem dependência de libs externas.
 * - Sem warnings de lint (nenhum import/var não usado).
 *
 * Uso:
 * <ParallaxMotion strength={0.12}>{...}</ParallaxMotion>
 */
export default function ParallaxMotion({
  children,
  strength = 0.12,
}: {
  children: ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const viewport = window.innerHeight || 1

        // Normaliza: -1..1
        const center = rect.top + rect.height / 2
        const n = (center - viewport / 2) / (viewport / 2)

        // Aplica Y leve (parallax)
        const y = n * -1 * (viewport * strength)
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      el.style.transform = "translate3d(0, 0, 0)"
    }
  }, [strength])

  return <div ref={ref}>{children}</div>
}
