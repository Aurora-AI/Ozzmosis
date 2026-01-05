'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface LifeMapData {
  horizonte: number
  risco: number
  liquidez: number
  patrimonio: number
}

interface LifeMapCompassProps {
  onSubmit: (data: LifeMapData) => Promise<void>
  isLoading: boolean
}

const sliders = [
  {
    key: 'horizonte',
    label: 'Horizonte de Tempo',
    description: 'Prazo para seus principais objetivos',
    min: 1,
    max: 30,
    default: 10,
    format: (v: number) => `${v} ${v === 1 ? 'ano' : 'anos'}`
  },
  {
    key: 'risco',
    label: 'Tolerância a Risco',
    description: 'Quanto de volatilidade você aceita',
    min: 0,
    max: 100,
    default: 50,
    format: (v: number) => {
      if (v < 30) return 'Conservador'
      if (v < 60) return 'Moderado'
      if (v < 80) return 'Arrojado'
      return 'Agressivo'
    }
  },
  {
    key: 'liquidez',
    label: 'Necessidade de Liquidez',
    description: 'Acesso rápido vs. rendimento maior',
    min: 0,
    max: 100,
    default: 50,
    format: (v: number) => {
      if (v < 30) return 'Pode esperar'
      if (v < 60) return 'Equilíbrio'
      return 'Preciso acessar'
    }
  },
  {
    key: 'patrimonio',
    label: 'Patrimônio Investível',
    description: 'Capital disponível para investir',
    min: 100,
    max: 10000,
    default: 500,
    format: (v: number) => `R$ ${v >= 1000 ? (v/1000).toFixed(1) + 'M' : v + 'K'}`
  }
]

/**
 * LifeMap Compass - Fantasy.co Inspired
 *
 * Design principles:
 * - Minimal slider design (single pixel track)
 * - Floating labels with parallax
 * - Breathing loading state
 * - Extreme whitespace
 */
export function LifeMapCompass({ onSubmit, isLoading }: LifeMapCompassProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [60, -60])

  const [values, setValues] = useState<LifeMapData>({
    horizonte: 10,
    risco: 50,
    liquidez: 50,
    patrimonio: 500
  })

  const handleChange = (key: keyof LifeMapData, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit(values)
  }

  return (
    <section ref={containerRef} className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="mb-24 text-center"
            style={{ y: headerY }}
          >
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Life Map
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Calibre seu
              <br />
              mapa financeiro
            </motion.h2>
          </motion.div>

          {/* Sliders */}
          <div className="space-y-16">
            {sliders.map((slider, index) => (
              <motion.div
                key={slider.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {/* Label Row */}
                <div className="flex justify-between items-baseline mb-6">
                  <div>
                    <h3 className="text-lg" style={{ fontWeight: 500 }}>
                      {slider.label}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--black-piano-40)' }}>
                      {slider.description}
                    </p>
                  </div>
                  <span
                    className="text-2xl tabular-nums"
                    style={{
                      fontWeight: 500,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {slider.format(values[slider.key as keyof LifeMapData])}
                  </span>
                </div>

                {/* Slider Track */}
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={values[slider.key as keyof LifeMapData]}
                  onChange={(e) => handleChange(slider.key as keyof LifeMapData, Number(e.target.value))}
                  className="w-full"
                  disabled={isLoading}
                />
              </motion.div>
            ))}
          </div>

          {/* Submit */}
          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary"
              style={{
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'wait' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Organizando...
                </>
              ) : (
                'Gerar Propostas'
              )}
            </button>

            {isLoading && (
              <motion.p
                className="mt-8 animate-breathe"
                style={{ color: 'var(--black-piano-40)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Estamos organizando seu mapa financeiro
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
