'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Home, Briefcase, Heart, Shield, TrendingUp, Plane } from 'lucide-react'

interface DecisionTile {
  id: string
  icon: React.ReactNode
  title: string
  description: string
}

const tiles: DecisionTile[] = [
  {
    id: 'patrimonio',
    icon: <Home size={24} strokeWidth={1.5} />,
    title: 'Patrimônio',
    description: 'Construir, proteger e multiplicar bens'
  },
  {
    id: 'negocios',
    icon: <Briefcase size={24} strokeWidth={1.5} />,
    title: 'Negócios',
    description: 'Expandir ou preparar sucessão'
  },
  {
    id: 'familia',
    icon: <Heart size={24} strokeWidth={1.5} />,
    title: 'Família',
    description: 'Educação, saúde e tranquilidade'
  },
  {
    id: 'protecao',
    icon: <Shield size={24} strokeWidth={1.5} />,
    title: 'Proteção',
    description: 'Blindagem e contingência'
  },
  {
    id: 'investimentos',
    icon: <TrendingUp size={24} strokeWidth={1.5} />,
    title: 'Investimentos',
    description: 'Diversificação e rentabilidade'
  },
  {
    id: 'lifestyle',
    icon: <Plane size={24} strokeWidth={1.5} />,
    title: 'Lifestyle',
    description: 'Viagens, experiências e conquistas'
  }
]

interface DecisionSpaceProps {
  onSelect: (selections: string[]) => void
  selections: string[]
}

/**
 * Decision Space - Fantasy.co Inspired
 *
 * Design principles:
 * - Cards floating on white, minimal borders
 * - Inverted state (black) on selection
 * - Staggered reveal animation
 * - Each card has slight parallax offset
 */
export function DecisionSpace({ onSelect, selections }: DecisionSpaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  // Parallax for header
  const headerY = useTransform(scrollYProgress, [0, 1], [50, -50])

  const toggleSelection = (id: string) => {
    if (selections.includes(id)) {
      onSelect(selections.filter(s => s !== id))
    } else {
      onSelect([...selections, id])
    }
  }

  return (
    <section ref={containerRef} className="section">
      <div className="container">
        {/* Section Header - Parallax */}
        <motion.div
          className="mb-24"
          style={{ y: headerY }}
        >
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Espaço de Decisões
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            O que move suas
            <br />
            decisões financeiras?
          </motion.h2>

          <motion.p
            className="mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Selecione as áreas que mais importam para você neste momento.
          </motion.p>
        </motion.div>

        {/* Decision Tiles Grid - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, index) => {
            const isSelected = selections.includes(tile.id)

            return (
              <motion.button
                key={tile.id}
                onClick={() => toggleSelection(tile.id)}
                className={`card text-left cursor-pointer transition-all duration-500 ${
                  isSelected ? 'card-selected' : ''
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -4 }}
              >
                {/* Icon */}
                <div
                  className="mb-6 transition-colors duration-500"
                  style={{
                    color: isSelected ? 'var(--background)' : 'var(--black-piano)'
                  }}
                >
                  {tile.icon}
                </div>

                {/* Title */}
                <h3
                  className="mb-3 transition-colors duration-500"
                  style={{
                    color: isSelected ? 'var(--background)' : 'var(--black-piano)'
                  }}
                >
                  {tile.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm transition-colors duration-500"
                  style={{
                    color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--black-piano-40)'
                  }}
                >
                  {tile.description}
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* Selection Counter */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: selections.length > 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="eyebrow">
            {selections.length} {selections.length === 1 ? 'área selecionada' : 'áreas selecionadas'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
