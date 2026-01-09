'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Check, Shield, TrendingUp, Zap } from 'lucide-react'

export interface Proposal {
  id: string
  name: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  expectedReturn: string
  highlights: string[]
  recommended?: boolean
}

interface ProposalCardsProps {
  proposals: Proposal[]
  selectedId: string | null
  onSelect: (id: string) => void
  isLoading: boolean
}

const riskIcons = {
  low: <Shield size={20} strokeWidth={1.5} />,
  medium: <TrendingUp size={20} strokeWidth={1.5} />,
  high: <Zap size={20} strokeWidth={1.5} />
}

const riskLabels = {
  low: 'Conservador',
  medium: 'Moderado',
  high: 'Arrojado'
}

/**
 * Proposal Cards - Fantasy.co Inspired
 *
 * Design principles:
 * - Clean cards floating on white
 * - Minimal visual weight
 * - Strong typographic hierarchy
 * - Parallax depth
 */
export function ProposalCards({ proposals, selectedId, onSelect, isLoading }: ProposalCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [60, -60])

  if (isLoading) {
    return (
      <section className="section">
        <div className="container text-center">
          <p className="animate-breathe" style={{ color: 'var(--black-piano-40)' }}>
            Carregando propostas...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="section">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="mb-24 text-center max-w-2xl mx-auto"
          style={{ y: headerY }}
        >
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Propostas
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Estratégias personalizadas
            <br />
            para você
          </motion.h2>
        </motion.div>

        {/* Proposal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {proposals.map((proposal, index) => {
            const isSelected = selectedId === proposal.id

            return (
              <motion.button
                key={proposal.id}
                onClick={() => onSelect(proposal.id)}
                className={`card text-left cursor-pointer flex flex-col h-full transition-all duration-500 ${
                  isSelected ? 'card-selected' : ''
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -6 }}
                style={{
                  borderWidth: proposal.recommended && !isSelected ? '2px' : '1px'
                }}
              >
                {/* Recommended Badge */}
                {proposal.recommended && !isSelected && (
                  <span
                    className="eyebrow mb-6"
                    style={{ color: 'var(--black-piano)' }}
                  >
                    Recomendado
                  </span>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div style={{ color: isSelected ? 'var(--background)' : 'var(--black-piano)' }}>
                    {riskIcons[proposal.riskLevel]}
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{ color: 'var(--background)' }}
                    >
                      <Check size={20} />
                    </motion.div>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="text-2xl mb-3"
                  style={{
                    color: isSelected ? 'var(--background)' : 'var(--black-piano)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {proposal.name}
                </h3>

                {/* Description */}
                <p
                  className="text-sm mb-6 flex-grow"
                  style={{
                    color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--black-piano-40)'
                  }}
                >
                  {proposal.description}
                </p>

                {/* Meta */}
                <div
                  className="flex items-center gap-3 mb-6 text-xs"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : 'var(--black-piano-40)' }}
                >
                  <span className="uppercase tracking-wider">
                    {riskLabels[proposal.riskLevel]}
                  </span>
                  <span>•</span>
                  <span style={{ fontWeight: 500 }}>
                    {proposal.expectedReturn} a.a.
                  </span>
                </div>

                {/* Highlights */}
                <ul
                  className="pt-6 space-y-3"
                  style={{
                    borderTop: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : 'var(--black-piano-10)'}`
                  }}
                >
                  {proposal.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--black-piano-60)' }}
                    >
                      <Check
                        size={14}
                        style={{
                          color: isSelected ? 'var(--background)' : 'var(--black-piano)',
                          flexShrink: 0,
                          marginTop: 3
                        }}
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
