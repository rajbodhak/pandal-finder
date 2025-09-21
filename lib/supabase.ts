import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For backward compatibility with existing code
export const client = supabase;

// Account service for authentication
export const account = {
    create: async (userId: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data.user;
    },

    createEmailSession: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data.session;
    },

    deleteSession: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    get: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },
};

// Database service wrapper (for compatibility)
export const databases = {
    listDocuments: async (databaseId: string, collectionId: string, queries?: any[]) => {
        let query = supabase.from('pandals').select('*');

        // Handle Appwrite-style queries
        if (queries && queries.length > 0) {
            for (const q of queries) {
                if (q.field === 'area' && q.operator === 'eq') {
                    query = query.eq('area', q.value);
                } else if (q.field === 'rating' && q.operator === 'gt') {
                    query = query.gt('rating', q.value);
                } else if (q.field === 'crowd_level' && q.operator === 'eq') {
                    if (Array.isArray(q.value)) {
                        query = query.in('crowd_level', q.value);
                    } else {
                        query = query.eq('crowd_level', q.value);
                    }
                } else if (q.operator === 'or' && q.queries) {
                    // Handle OR queries for search
                    const orConditions = q.queries.map((orQ: any) => {
                        if (orQ.field === 'name' && orQ.operator === 'ilike') {
                            return `name.ilike.${orQ.value}`;
                        } else if (orQ.field === 'description' && orQ.operator === 'ilike') {
                            return `description.ilike.${orQ.value}`;
                        } else if (orQ.field === 'address' && orQ.operator === 'ilike') {
                            return `address.ilike.${orQ.value}`;
                        }
                        return '';
                    }).filter(Boolean).join(',');

                    if (orConditions) {
                        query = query.or(orConditions);
                    }
                } else if (q.order === 'desc') {
                    query = query.order(q.field, { ascending: false });
                } else if (q.limit) {
                    query = query.limit(q.limit);
                }
            }
        }

        const { data, error } = await query;
        if (error) throw error;

        // Convert to Appwrite format
        const documents = (data || []).map((item: any) => ({
            $id: item.id,
            ...item,
        }));

        return {
            documents,
            total: documents.length
        };
    },

    createDocument: async (databaseId: string, collectionId: string, documentId: string, data: any) => {
        // Convert data to match your Pandal interface
        const supabaseData = {
            name: data.name,
            description: data.description,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            rating: data.rating,
            imageUrl: data.imageUrl,
            imageId: data.imageId,
            area: data.area, // Will validate against enum
            category: data.category,
            special_features: Array.isArray(data.special_features) ? data.special_features : [],
            crowd_level: data.crowd_level,
        };

        const { data: result, error } = await supabase
            .from('pandals')
            .insert(supabaseData)
            .select()
            .single();

        if (error) throw error;

        // Return in Appwrite format for compatibility
        return {
            $id: result.id,
            ...result,
        };
    },

    updateDocument: async (databaseId: string, collectionId: string, documentId: string, data: any) => {
        const { data: result, error } = await supabase
            .from('pandals')
            .update(data)
            .eq('id', documentId)
            .select()
            .single();

        if (error) throw error;

        return {
            $id: result.id,
            ...result,
        };
    },

    deleteDocument: async (databaseId: string, collectionId: string, documentId: string) => {
        const { error } = await supabase
            .from('pandals')
            .delete()
            .eq('id', documentId);

        if (error) throw error;
    },

    getDocument: async (databaseId: string, collectionId: string, documentId: string) => {
        const { data, error } = await supabase
            .from('pandals')
            .select('*')
            .eq('id', documentId)
            .single();

        if (error) throw error;

        return {
            $id: data.id,
            ...data,
        };
    },
};

// Storage service (basic compatibility)
export const storage = {
    getFileView: (bucketId: string, fileId: string) => {
        // Return the imageUrl directly since we're storing URLs now
        return fileId; // This assumes you'll update to store direct URLs
    },
};

// Query helpers (for compatibility)
export const Query = {
    equal: (field: string, value: any) => ({ field, operator: 'eq', value }),
    search: (field: string, value: string) => ({ field, operator: 'ilike', value: `%${value}%` }),
    orderDesc: (field: string) => ({ field, order: 'desc' }),
    limit: (count: number) => ({ limit: count }),
    greaterThan: (field: string, value: any) => ({ field, operator: 'gt', value }),
    or: (queries: any[]) => ({ operator: 'or', queries }),
};

// ID helper
export const ID = {
    unique: () => crypto.randomUUID(),
};