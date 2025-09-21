// import { databases, Query, storage } from "./appwrite";
// import { Pandal } from "./types";

// const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
// const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PANDALS_COLLECTION_ID!;
// const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;

// export class DatabaseService {

//     // Helper method to format document
//     private formatPandal(doc: any): Pandal {
//         return {
//             $id: doc.$id,
//             name: doc.name,
//             description: doc.description,
//             area: doc.area,
//             address: doc.address,
//             latitude: doc.latitude,
//             longitude: doc.longitude,
//             rating: doc.rating,
//             imageUrl: doc.imageUrl,
//             imageId: doc.imageId,
//             category: doc.category,
//             special_features: doc.special_features || [],
//             crowd_level: doc.crowd_level,
//             created_at: doc.created_at,
//             updated_at: doc.updated_at
//         };
//     }


//     //creating pandal
//     async createPandal(pandal: Omit<Pandal, '$id' | 'created_at' | 'updated_at'>) {
//         try {
//             const now = new Date().toISOString();
//             const response = await databases.createDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 'unique()',
//                 {
//                     ...pandal,
//                     special_features: pandal.special_features || [],
//                     created_at: now,
//                     updated_at: now
//                 }
//             );
//             return this.formatPandal(response);
//         } catch (error) {
//             throw error
//         }
//     }

//     //Get all pandals
//     async getAllPandals() {
//         try {
//             const response = await databases.listDocuments(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 [Query.orderDesc('created_at'),
//                 Query.limit(1000)
//                 ]
//             );
//             return response.documents.map(doc => this.formatPandal(doc));
//         } catch (error) {
//             throw error;
//         }
//     }

//     //Get Pandal by Id
//     async getPandalById(id: string): Promise<Pandal> {
//         try {
//             const response = await databases.getDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 id
//             )
//             return this.formatPandal(response);
//         } catch (error) {
//             throw error;
//         }
//     }

//     //Update Pandal
//     async updatePandal(id: string, updates: Partial<Pandal>) {
//         try {
//             const updateData: Record<string, any> = {
//                 ...updates,
//                 updated_at: new Date().toISOString(),
//             };

//             if (updates.special_features) {
//                 updateData.special_features = JSON.stringify(updates.special_features);
//             }

//             const response = await databases.updateDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 id,
//                 updateData
//             );

//             return this.formatPandal(response);
//         } catch (error) {
//             throw error;
//         }
//     }

//     //Delete Pandal
//     async deletePandal(id: string) {
//         try {
//             await databases.deleteDocument(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 id
//             )
//         } catch (error) {

//             throw error;
//         }
//     }

//     //Search Pandal
//     async searchPandal(query: string): Promise<Pandal[]> {
//         try {
//             const response = await databases.listDocuments(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 [
//                     Query.or([
//                         Query.search('name', query),
//                         Query.search('description', query),
//                         Query.search('address', query)
//                     ])
//                 ]
//             );
//             return response.documents.map(doc => this.formatPandal(doc));
//         } catch (error) {
//             throw error
//         }
//     }

//     // Get pandals by area for roadmap
//     async getPandalsByArea(area: string) {
//         try {
//             const response = await databases.listDocuments(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 [
//                     Query.equal('area', area),
//                     Query.orderDesc('rating'),
//                     Query.limit(25)
//                 ]
//             );
//             return response.documents.map(doc => this.formatPandal(doc));
//         } catch (error) {

//             throw error;
//         }
//     }

//     // Get pandals by multiple areas (if user wants to explore multiple areas)
//     async getPandalsByAreas(areas: string[]) {
//         try {
//             const response = await databases.listDocuments(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 [
//                     Query.equal('area', areas),
//                     Query.orderDesc('rating'),
//                     Query.limit(50)
//                 ]
//             );
//             return response.documents.map(doc => this.formatPandal(doc));
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Get top-rated pandals by area (for priority routes)
//     async getTopPandalsByArea(area: string, limit: number = 10) {
//         try {
//             const response = await databases.listDocuments(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 [
//                     Query.equal('area', area),
//                     Query.greaterThan('rating', 4.0), // Only high-rated pandals
//                     Query.orderDesc('rating'),
//                     Query.limit(limit)
//                 ]
//             );
//             return response.documents.map(doc => this.formatPandal(doc));
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Get pandals by crowd level (for less crowded routes)
//     async getPandalsByAreaAndCrowdLevel(area: string, crowdLevels: string[] = ['low', 'medium']) {
//         try {
//             const response = await databases.listDocuments(
//                 DATABASE_ID,
//                 COLLECTION_ID,
//                 [
//                     Query.equal('area', area),
//                     Query.equal('crowd_level', crowdLevels),
//                     Query.orderDesc('rating'),
//                     Query.limit(20)
//                 ]
//             );
//             return response.documents.map(doc => this.formatPandal(doc));
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Get image URL
//     getImageUrl(imageId: string) {
//         return storage.getFileView(BUCKET_ID, imageId);
//     }
// }

// export const databaseService = new DatabaseService();



import { supabase } from "./supabase";
import { Pandal } from "./types";

export class DatabaseService {

    // Helper method to format document from Supabase to Appwrite format
    private formatPandal(doc: any): Pandal {
        return {
            $id: doc.id,
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

    // Creating pandal
    async createPandal(pandal: Omit<Pandal, '$id' | 'created_at' | 'updated_at'>) {
        try {
            const now = new Date().toISOString();
            const { data, error } = await supabase
                .from('pandals')
                .insert({
                    name: pandal.name,
                    description: pandal.description,
                    area: pandal.area,
                    address: pandal.address,
                    latitude: pandal.latitude,
                    longitude: pandal.longitude,
                    rating: pandal.rating,
                    imageUrl: pandal.imageUrl,
                    imageId: pandal.imageId,
                    category: pandal.category,
                    special_features: pandal.special_features || [],
                    crowd_level: pandal.crowd_level,
                    created_at: now,
                    updated_at: now
                })
                .select()
                .single();

            if (error) throw error;
            return this.formatPandal(data);
        } catch (error) {
            throw error;
        }
    }

    // Get all pandals
    async getAllPandals() {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1000);

            if (error) throw error;
            return (data || []).map(doc => this.formatPandal(doc));
        } catch (error) {
            throw error;
        }
    }

    // Get Pandal by Id
    async getPandalById(id: string): Promise<Pandal> {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return this.formatPandal(data);
        } catch (error) {
            throw error;
        }
    }

    // Update Pandal
    async updatePandal(id: string, updates: Partial<Pandal>) {
        try {
            const updateData: Record<string, any> = {
                ...updates,
                updated_at: new Date().toISOString(),
            };

            // Remove $id if it exists in updates
            delete updateData.$id;

            const { data, error } = await supabase
                .from('pandals')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return this.formatPandal(data);
        } catch (error) {
            throw error;
        }
    }

    // Delete Pandal
    async deletePandal(id: string) {
        try {
            const { error } = await supabase
                .from('pandals')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            throw error;
        }
    }

    // Search Pandal
    async searchPandal(query: string): Promise<Pandal[]> {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`);

            if (error) throw error;
            return (data || []).map(doc => this.formatPandal(doc));
        } catch (error) {
            throw error;
        }
    }

    // Get pandals by area for roadmap
    async getPandalsByArea(area: string) {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .eq('area', area)
                .order('rating', { ascending: false })
                .limit(25);

            if (error) throw error;
            return (data || []).map(doc => this.formatPandal(doc));
        } catch (error) {
            throw error;
        }
    }

    // Get pandals by multiple areas
    async getPandalsByAreas(areas: string[]) {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .in('area', areas)
                .order('rating', { ascending: false })
                .limit(50);

            if (error) throw error;
            return (data || []).map(doc => this.formatPandal(doc));
        } catch (error) {
            throw error;
        }
    }

    // Get top-rated pandals by area
    async getTopPandalsByArea(area: string, limit: number = 10) {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .eq('area', area)
                .gt('rating', 4.0)
                .order('rating', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return (data || []).map(doc => this.formatPandal(doc));
        } catch (error) {
            throw error;
        }
    }

    // Get pandals by crowd level
    async getPandalsByAreaAndCrowdLevel(area: string, crowdLevels: string[] = ['low', 'medium']) {
        try {
            const { data, error } = await supabase
                .from('pandals')
                .select('*')
                .eq('area', area)
                .in('crowd_level', crowdLevels)
                .order('rating', { ascending: false })
                .limit(20);

            if (error) throw error;
            return (data || []).map(doc => this.formatPandal(doc));
        } catch (error) {
            throw error;
        }
    }

    // Get image URL (just return the URL since we're storing direct URLs)
    getImageUrl(imageId: string) {
        return imageId; // Direct URL or fallback to imageId
    }
}

export const databaseService = new DatabaseService();