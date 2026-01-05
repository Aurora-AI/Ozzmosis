'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'

interface HeroProps {
  onStartJourney: () => void
}

/**
 * Hero Section - Fantasy.co Inspired
 *
 * Design principles:
 * - Massive typography floating on absolute white
 * - Extreme negative space
 * - Parallax depth on scroll
 * - Minimal, intentional motion
 */
export function Hero({ onStartJourney }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Parallax effects
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const sublineY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section
      ref={containerRef}
      className="section relative"
      style={{ minHeight: '100vh' }}
    >
      <div className="container">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.p
            className="eyebrow mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Aurora Genesis
          </motion.p>

          {/* Main Headline - Parallax Layer 1 */}
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Você não preenche
              <br />
              formulários.
            </motion.h1>

            <motion.h1
              className="mt-4"
              style={{ color: 'var(--black-piano-40)' }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Você constrói
              <br />
              decisões.
            </motion.h1>
          </motion.div>

          {/* Subline - Parallax Layer 2 */}
          <motion.p
            className="mt-16 max-w-xl"
            style={{ y: sublineY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Private banking reimaginado. Uma experiência que entende
            suas escolhas antes de você precisar explicá-las.
          </motion.p>

          {/* CTA - Parallax Layer 3 */}
          <motion.div
            className="mt-16"
            style={{ y: ctaY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onStartJourney}
              className="btn-primary"
            >
              Iniciar Jornada
              <ArrowDown size={16} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Floating at bottom */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="eyebrow">Role para explorar</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} style={{ color: 'var(--black-piano-40)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
