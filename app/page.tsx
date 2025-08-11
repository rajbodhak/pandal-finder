import { Metadata } from 'next'
import PandalFinderPage from './PandalFinderClient'

// Metadata export (only works in server components)
export const metadata: Metadata = {
  title: 'DuggaKhoj - Find the Best Durga Puja Pandals in Kolkata',
  description: 'Discover amazing Durga Puja pandals near you in Kolkata. Get directions, timings, crowd updates, and navigate top Durga Puja pandals with custom routes.',
  keywords: [
    'durga puja pandals kolkata',
    'durga puja 2025',
    'best pandals near me',
    'duggakhoj',
    'kolkata durga puja 2025',
    'pandal hopping guide',
    'durga puja celebrations',
    'kolkata durga puja guide',
    'kolkata best durga puja pandals',
    'durga puja guide kolkata',
    'north kolkata pandals',
    'south kolkata pandals',
    'central kolkata pandals',
    'north kolkata durga puja pandals',
    'south kolkata durga puja pandals',
    'central kolkata durga puja pandals',
    'কলকাতা দুর্গা পূজা'
  ],
  openGraph: {
    title: 'DuggaKhoj - Discover the Best Durga Puja Pandals',
    description: 'Your ultimate companion for exploring Durga Puja pandals in Kolkata. Find pandals, get directions, and plan your route.',
    url: 'https://duggakhoj.site',
  },
}

// Server component that renders the client component
export default function HomePage() {
  return <PandalFinderPage />
}