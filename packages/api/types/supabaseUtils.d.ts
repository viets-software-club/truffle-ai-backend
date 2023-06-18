import { Database } from './supabase'

type ProjectInsertion = Database['public']['Tables']['project']['Insert']
type ProjectUpdate = Database['public']['Tables']['project']['Update']

type OrganizationInsertion = Database['public']['Tables']['organization']['Insert']
type OrganizationUpdate = Database['public']['Tables']['organization']['Update']

type PersonInsertion = Database['public']['Tables']['associated_person']['Insert']

type FoundedByInsertion = Database['public']['Tables']['founded_by']['Insert']

// has to be named ProjectInfo because otherwise there could be name conflict with supabaseType
type ProjectInfo = {
  name: string
  owner: string
}
