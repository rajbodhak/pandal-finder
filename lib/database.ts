import { databases, Query } from "./appwrite";
import { Pandal, FilterOptions, PandalWithDistance } from "./types";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PANDALS_COLLECTION_ID!;

export class DatabaseService {

    // Helper method to format document
    private formatPandal(doc: any): Pandal {
        return {
            $id: doc.$id,
            name: doc.name,
            description: doc.description,
            address: doc.address,
            latitude: doc.latitude,
            longitude: doc.longitude,
            rating: doc.rating,
            imageUrl: doc.imageUrl,
            imageId: doc.imageId,
            category: doc.category,
            established_year: doc.established_year,
            organizer: doc.organizer,
            visiting_hours: doc.visiting_hours,
            special_features: doc.special_features ? JSON.parse(doc.special_features) : [],
            crowd_level: doc.crowd_level,
            accessibility_features: doc.accessibility_features ? JSON.parse(doc.accessibility_features) : [],
            created_at: doc.created_at,
            updated_at: doc.updated_at
        };
    };

    //creating pandal
    async createPandal(pandal: Omit<Pandal, '$id' | 'created_at' | 'updated_at'>) {
        try {
            const now = new Date().toISOString();
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                'unique()',
                {
                    ...pandal,
                    special_features: JSON.stringify(pandal.special_features || []),
                    assessibility_features: JSON.stringify(pandal.accessibility_features || []),
                    created_at: now,
                    updated_at: now
                }
            );
            return this.formatPandal(response);
        } catch (error) {
            console.log("Error", error);
            throw error
        }
    }

    //Get all pandals
    async getAllPandals() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.orderDesc('created_at')]
            );
            return response.documents.map(doc => this.formatPandal(doc));
        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }

    //Get Pandal by Id
    async getPandalById(id: string): Promise<Pandal> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )
            return this.formatPandal(response);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //Update Pandal
    async updatePandal(id: string, updates: Partial<Pandal>) {
        try {
            const updateData: Record<string, any> = {
                ...updates,
                updated_at: new Date().toISOString(),
            };

            if (updates.special_features) {
                updateData.special_features = JSON.stringify(updates.special_features);
            }

            if (updates.accessibility_features) {
                updateData.accessibility_features = JSON.stringify(updates.accessibility_features);
            }

            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id,
                updateData
            );

            return this.formatPandal(response);
        } catch (error) {
            console.log("Error updating pandal:", error);
            throw error;
        }
    }

    //Delete Pandal
    async deletePandal(id: string) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )
        } catch (error) {
            console.log("Error", error);
            throw error;
        }
    }

    //Search Pandal
    async searchPandal(query: string): Promise<Pandal[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.or([
                        Query.search('name', query),
                        Query.search('description', query),
                        Query.search('address', query)
                    ])
                ]
            );
            return response.documents.map(doc => this.formatPandal(doc));
        } catch (error) {
            console.log("searchPandal error", error);
            throw error
        }
    }

    // Filter pandals
    async filterPandals(filters: FilterOptions): Promise<Pandal[]> {
        try {
            const queries = [];

            if (filters.category) {
                queries.push(Query.equal('category', filters.category));
            }

            if (filters.minRating) {
                queries.push(Query.greaterThanEqual('rating', filters.minRating));
            }

            if (filters.crowdLevel && filters.crowdLevel.length > 0) {
                queries.push(Query.equal('crowd_level', filters.crowdLevel));
            }

            // Add sorting
            switch (filters.sortBy) {
                case 'rating':
                    queries.push(Query.orderDesc('rating'));
                    break;
                case 'name':
                    queries.push(Query.orderAsc('name'));
                    break;
                default:
                    queries.push(Query.orderDesc('created_at'));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                queries
            );
            return response.documents.map(doc => this.formatPandal(doc));
        } catch (error) {
            console.error('Error filtering pandals:', error);
            throw error;
        }
    }
}

export const databaseService = new DatabaseService();