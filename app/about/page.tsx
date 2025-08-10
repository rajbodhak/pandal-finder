import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: 'About DuggaKhoj - Your Pandal Hopping Companion',
    description: 'Learn about DuggaKhoj, the ultimate guide for Durga Puja pandal hopping in Kolkata. Discover our mission to make your festival experience unforgettable.',
    keywords: [
        'about duggakhoj',
        'durga puja guide',
        'pandal hopping app',
        'kolkata festival guide',
        'duggakhoj team',
        'pandal finder story'
    ],
    openGraph: {
        title: 'About DuggaKhoj - Making Pandal Hopping Easy',
        description: 'Discover how DuggaKhoj helps thousands of devotees and tourists explore the best of Kolkata Durga Puja.',
        url: 'https://duggakhoj.site/about',
    },
}

export default function AboutPage() {
    return <AboutClient />
}