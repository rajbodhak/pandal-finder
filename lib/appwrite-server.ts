import { Client, Databases, Storage, Query } from 'node-appwrite';

// Server-only credentials 
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

export const serverDatabases = new Databases(client);
export const serverStorage = new Storage(client);

// Export these for use in API routes
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.APPWRITE_PANDALS_COLLECTION_ID!;
export const BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID!;

// Re-export Query for convenience
export { Query };