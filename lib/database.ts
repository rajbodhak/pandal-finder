import { Pandal } from "./types";

const API_BASE = '/api/pandals';

export class DatabaseService {
    // Helper method to format document
    private formatPandal(doc: any): Pandal {
        return {
            $id: doc.$id,
            name: doc.name,
            description: doc.description,
            area: doc.area,
            address: doc.address,
            latitude: doc.latitude,
            longitude: doc.longitude,
            rating: doc.rating,
            imageUrl: doc.imageUrl,
            imageId: doc.imageId,
            category: doc.category,
            special_features: doc.special_features || [],
            crowd_level: doc.crowd_level,
            created_at: doc.created_at,
            updated_at: doc.updated_at
        };
    }

    // Get all pandals
    async getAllPandals() {
        try {
            const response = await fetch(API_BASE, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pandals');
            }

            const data = await response.json();
            return data.documents.map((doc: any) => this.formatPandal(doc));
        } catch (error) {
            console.error('Error fetching pandals:', error);
            throw error;
        }
    }

    // Get Pandal by Id
    async getPandalById(id: string): Promise<Pandal> {
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Pandal not found');
            }

            const data = await response.json();
            return this.formatPandal(data);
        } catch (error) {
            console.error('Error fetching pandal:', error);
            throw error;
        }
    }

    // Search Pandal
    async searchPandal(query: string): Promise<Pandal[]> {
        try {
            const response = await fetch(
                `${API_BASE}/search?q=${encodeURIComponent(query)}`,
                { cache: 'no-store' }
            );

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            return data.documents.map((doc: any) => this.formatPandal(doc));
        } catch (error) {
            console.error('Error searching pandals:', error);
            throw error;
        }
    }

    // Get pandals by area for roadmap
    async getPandalsByArea(area: string) {
        try {
            const response = await fetch(
                `${API_BASE}/area/${area}?limit=25`,
                { cache: 'no-store' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch pandals by area');
            }

            const data = await response.json();
            return data.documents.map((doc: any) => this.formatPandal(doc));
        } catch (error) {
            console.error('Error fetching pandals by area:', error);
            throw error;
        }
    }

    // Get pandals by multiple areas
    async getPandalsByAreas(areas: string[]) {
        try {
            const response = await fetch(
                `${API_BASE}/areas?areas=${areas.join(',')}&limit=50`,
                { cache: 'no-store' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch pandals by areas');
            }

            const data = await response.json();
            return data.documents.map((doc: any) => this.formatPandal(doc));
        } catch (error) {
            console.error('Error fetching pandals by areas:', error);
            throw error;
        }
    }

    // Get top-rated pandals by area
    async getTopPandalsByArea(area: string, limit: number = 10) {
        try {
            const response = await fetch(
                `${API_BASE}/area/${area}?limit=${limit}&minRating=4.0`,
                { cache: 'no-store' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch top pandals');
            }

            const data = await response.json();
            return data.documents.map((doc: any) => this.formatPandal(doc));
        } catch (error) {
            console.error('Error fetching top pandals:', error);
            throw error;
        }
    }

    // Get pandals by crowd level
    async getPandalsByAreaAndCrowdLevel(
        area: string,
        crowdLevels: string[] = ['low', 'medium']
    ) {
        try {
            const response = await fetch(
                `${API_BASE}/area/${area}?limit=20&crowdLevels=${crowdLevels.join(',')}`,
                { cache: 'no-store' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch pandals by crowd level');
            }

            const data = await response.json();
            return data.documents.map((doc: any) => this.formatPandal(doc));
        } catch (error) {
            console.error('Error fetching pandals by crowd level:', error);
            throw error;
        }
    }

    // Get image URL (for now, placeholder - need to handle this separately)
    getImageUrl(imageId: string) {
        //  need to create an API route for images too if needed
        return `/api/images/${imageId}`;
    }

    // TODO: Create, Update, Delete methods will need separate API routes
    // with authentication/authorization
}

export const databaseService = new DatabaseService();