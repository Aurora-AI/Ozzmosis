'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Hero,
  DecisionSpace,
  LifeMapCompass,
  ProposalCards,
  Acceptance,
  ScrollIndicator,
  type Proposal
} from '@/components'
import { submitLifeMap, getProposals, acceptProposal } from '@/lib/api'

type Section = 'hero' | 'decisions' | 'lifemap' | 'proposals' | 'acceptance'

export default function HomePage() {
  // Section refs for navigation
  const heroRef = useRef<HTMLDivElement>(null)
  const decisionsRef = useRef<HTMLDivElement>(null)
  const lifemapRef = useRef<HTMLDivElement>(null)
  const proposalsRef = useRef<HTMLDivElement>(null)
  const acceptanceRef = useRef<HTMLDivElement>(null)

  // State
  const [activeSection, setActiveSection] = useState<Section>('hero')
  const [selections, setSelections] = useState<string[]>([])
  const [dealId, setDealId] = useState<string | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [isAccepted, setIsAccepted] = useState(false)

  // Loading states
  const [isSubmittingLifeMap, setIsSubmittingLifeMap] = useState(false)
  const [isLoadingProposals, setIsLoadingProposals] = useState(false)

  // Navigation
  const scrollToSection = useCallback((section: Section) => {
    const refs: Record<Section, React.RefObject<HTMLDivElement | null>> = {
      hero: heroRef,
      decisions: decisionsRef,
      lifemap: lifemapRef,
      proposals: proposalsRef,
      acceptance: acceptanceRef
    }

    refs[section].current?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(section)
  }, [])

  // Handlers
  const handleStartJourney = () => {
    scrollToSection('decisions')
  }

  const handleDecisionSelect = (newSelections: string[]) => {
    setSelections(newSelections)
    // Auto-advance when user has made selections
    if (newSelections.length > 0 && selections.length === 0) {
      setTimeout(() => scrollToSection('lifemap'), 800)
    }
  }

  const handleLifeMapSubmit = async (data: { horizonte: number; risco: number; liquidez: number; patrimonio: number }) => {
    setIsSubmittingLifeMap(true)

    try {
      // Submit life map
      const result = await submitLifeMap({ ...data, selections })
      setDealId(result.dealId)

      // Fetch proposals
      setIsLoadingProposals(true)
      const proposalsResult = await getProposals(result.dealId)
      setProposals(proposalsResult.proposals)

      // Navigate to proposals
      scrollToSection('proposals')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmittingLifeMap(false)
      setIsLoadingProposals(false)
    }
  }

  const handleProposalSelect = (id: string) => {
    setSelectedProposal(id)
    scrollToSection('acceptance')
  }

  const handleAccept = async () => {
    if (!dealId || !selectedProposal) return

    try {
      await acceptProposal({ dealId, proposalId: selectedProposal })
      setIsAccepted(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDownload = () => {
    // TODO: Generate and download PDF
    console.log('Download requested')
  }

  // Get selected proposal details
  const selectedProposalDetails = proposals.find(p => p.id === selectedProposal)

  // Determine visible sections for scroll indicator
  const visibleSections: Section[] = ['hero', 'decisions', 'lifemap']
  if (proposals.length > 0) visibleSections.push('proposals')
  if (selectedProposal) visibleSections.push('acceptance')

  return (
    <main>
      {/* Scroll Indicator */}
      <ScrollIndicator
        sections={visibleSections}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Hero Section */}
      <div ref={heroRef}>
        <Hero onStartJourney={handleStartJourney} />
      </div>

      {/* Decision Space */}
      <div ref={decisionsRef}>
        <DecisionSpace
          selections={selections}
          onSelect={handleDecisionSelect}
        />
      </div>

      {/* Life Map Compass */}
      <div ref={lifemapRef}>
        <LifeMapCompass
          onSubmit={handleLifeMapSubmit}
          isLoading={isSubmittingLifeMap}
        />
      </div>

      {/* Proposal Cards */}
      {proposals.length > 0 && (
        <div ref={proposalsRef}>
          <ProposalCards
            proposals={proposals}
            selectedId={selectedProposal}
            onSelect={handleProposalSelect}
            isLoading={isLoadingProposals}
          />
        </div>
      )}

      {/* Acceptance */}
      {selectedProposalDetails && (
        <div ref={acceptanceRef}>
          <Acceptance
            proposalName={selectedProposalDetails.name}
            onAccept={handleAccept}
            onDownload={handleDownload}
            isAccepted={isAccepted}
          />
        </div>
      )}
    </main>
  )
}
