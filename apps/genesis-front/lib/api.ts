/**
 * Aurora Genesis API Client
 *
 * Uses Next.js rewrites to proxy requests to the backend,
 * avoiding CORS issues during local development.
 */

const API_BASE = '/api/v1'

interface LifeMapPayload {
  horizonte: number
  risco: number
  liquidez: number
  patrimonio: number
  selections?: string[]
}

interface LifeMapResponse {
  success: boolean
  dealId: string
  message: string
}

interface Proposal {
  id: string
  name: string
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  expectedReturn: string
  highlights: string[]
  recommended?: boolean
}

interface ProposalsResponse {
  proposals: Proposal[]
}

interface AcceptancePayload {
  dealId: string
  proposalId: string
}

interface AcceptanceResponse {
  success: boolean
  confirmationId: string
}

/**
 * Submit Life Map data to create/update a Deal
 */
export async function submitLifeMap(data: LifeMapPayload): Promise<LifeMapResponse> {
  try {
    const response = await fetch(`${API_BASE}/life-map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[API] submitLifeMap failed:', error)
    // Return mock response for development
    return {
      success: true,
      dealId: `mock-deal-${Date.now()}`,
      message: 'Life Map processado com sucesso (mock)'
    }
  }
}

/**
 * Fetch proposals for a given Deal
 */
export async function getProposals(dealId: string): Promise<ProposalsResponse> {
  try {
    const response = await fetch(`${API_BASE}/proposals/by-deal/${dealId}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[API] getProposals failed:', error)
    // Return mock proposals for development
    return {
      proposals: [
        {
          id: 'conservador',
          name: 'Patrimônio Seguro',
          description: 'Estratégia focada em preservação de capital com exposição controlada a risco.',
          riskLevel: 'low',
          expectedReturn: '8-10%',
          highlights: [
            'Renda fixa de alta qualidade',
            'Fundos imobiliários selecionados',
            'Hedge cambial parcial'
          ]
        },
        {
          id: 'equilibrado',
          name: 'Crescimento Equilibrado',
          description: 'Balanceamento entre segurança e oportunidades de crescimento.',
          riskLevel: 'medium',
          expectedReturn: '12-15%',
          highlights: [
            'Mix ações/renda fixa',
            'Exposição internacional',
            'Private equity acessível'
          ],
          recommended: true
        },
        {
          id: 'arrojado',
          name: 'Aceleração Patrimonial',
          description: 'Estratégia agressiva para quem busca crescimento acelerado.',
          riskLevel: 'high',
          expectedReturn: '18-25%',
          highlights: [
            'Ações de alto potencial',
            'Venture capital',
            'Criptoativos selecionados'
          ]
        }
      ]
    }
  }
}

/**
 * Accept a proposal
 */
export async function acceptProposal(data: AcceptancePayload): Promise<AcceptanceResponse> {
  try {
    const response = await fetch(`${API_BASE}/proposals/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[API] acceptProposal failed:', error)
    // Return mock response for development
    return {
      success: true,
      confirmationId: `confirm-${Date.now()}`
    }
  }
}
