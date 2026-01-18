import { Client, Databases, Storage, Query, ID } from 'node-appwrite';

// Server-only credentials 
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

export const serverDatabases = new Databases(client);
export const serverStorage = new Storage(client);

// Export these for use in API routes
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PANDALS_COLLECTION_ID!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;

// Re-export Query and ID for convenience
export { Query, ID };