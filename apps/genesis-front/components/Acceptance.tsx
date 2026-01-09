'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle, ArrowRight, Download } from 'lucide-react'

interface AcceptanceProps {
  proposalName: string
  onAccept: () => void
  onDownload: () => void
  isAccepted: boolean
}

/**
 * Acceptance - Fantasy.co Inspired
 *
 * Design principles:
 * - Centered, dramatic typography
 * - Maximum white space
 * - Celebratory but restrained animation
 * - Clear, minimal actions
 */
export function Acceptance({ proposalName, onAccept, onDownload, isAccepted }: AcceptanceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <section ref={containerRef} className="section">
      <div className="container">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          style={{ y: contentY }}
        >
          {!isAccepted ? (
            <>
              {/* Pre-Acceptance */}
              <motion.p
                className="eyebrow mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Confirmação
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Pronto para começar
                <br />
                com {proposalName}?
              </motion.h2>

              <motion.p
                className="mt-8 mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Ao confirmar, nossa equipe entrará em contato para
                finalizar os detalhes e iniciar sua jornada.
              </motion.p>

              <motion.div
                className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <button onClick={onAccept} className="btn-primary">
                  Confirmar Escolha
                  <ArrowRight size={16} />
                </button>
                <button onClick={onDownload} className="btn-secondary">
                  <Download size={16} />
                  Baixar Resumo
                </button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Post-Acceptance */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="mb-12"
              >
                <CheckCircle
                  size={80}
                  strokeWidth={1}
                  style={{ color: 'var(--black-piano)', margin: '0 auto' }}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Decisão
                <br />
                registrada.
              </motion.h2>

              <motion.p
                className="mt-8 mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Sua escolha foi confirmada. Em breve, um especialista
                Aurora entrará em contato para dar continuidade.
              </motion.p>

              <motion.div
                className="mt-12 p-8 text-left mx-auto max-w-md"
                style={{
                  background: 'var(--black-piano-05)',
                  border: '1px solid var(--black-piano-10)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="eyebrow mb-2">Proposta selecionada</p>
                <p
                  className="text-2xl"
                  style={{
                    color: 'var(--black-piano)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {proposalName}
                </p>
              </motion.div>

              <motion.button
                onClick={onDownload}
                className="btn-secondary mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Download size={16} />
                Baixar Comprovante
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
