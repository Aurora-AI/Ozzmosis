'use client'

import { motion } from 'framer-motion'

type Section = 'hero' | 'decisions' | 'lifemap' | 'proposals' | 'acceptance'

interface ScrollIndicatorProps {
  sections: Section[]
  activeSection: Section
  onNavigate: (section: Section) => void
}

const sectionLabels: Record<Section, string> = {
  hero: 'Início',
  decisions: 'Decisões',
  lifemap: 'Life Map',
  proposals: 'Propostas',
  acceptance: 'Confirmação'
}

export function ScrollIndicator({ sections, activeSection, onNavigate }: ScrollIndicatorProps) {
  return (
    <nav className="scroll-indicator">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => onNavigate(section)}
          className="group relative"
          aria-label={sectionLabels[section]}
        >
          <motion.div
            className="scroll-dot"
            animate={{
              scale: activeSection === section ? 1.5 : 1,
              background: activeSection === section ? 'var(--black-piano)' : 'var(--black-piano-subtle)'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Tooltip */}
          <span
            className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: 'var(--black-piano)',
              color: 'var(--background)'
            }}
          >
            {sectionLabels[section]}
          </span>
        </button>
      ))}
    </nav>
  )
}
