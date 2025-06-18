import { databases, Query, storage } from "./appwrite";
import { Pandal, FilterOptions, PandalWithDistance } from "./types";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PANDALS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;

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
                    accessibility_features: JSON.stringify(pandal.accessibility_features || []), // FIXED: was assessibility_features
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

    // Get image URL
    getImageUrl(imageId: string) {
        return storage.getFileView(BUCKET_ID, imageId);
    }
}

export const databaseService = new DatabaseService();