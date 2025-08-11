import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/private/', '/signup', '/login'],
            },
        ],
        sitemap: 'https://duggakhoj.site/sitemap.xml',
    }
}