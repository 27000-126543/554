export interface User {
  id: string
  companyId: string
  companyName: string
  email: string
  role: 'enterprise' | 'esg_lead' | 'cfo' | 'ceo' | 'auditor' | 'admin'
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'diamond'
  industry: string
  region: string
}
