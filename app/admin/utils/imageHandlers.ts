import { ID, storage } from '@/lib/appwrite';

// Simple UUID generator for temporary use
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const uploadImageFile = async (file: File) => {
    const fileId = ID.unique();
    const uploadRes = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
        fileId,
        file
    );

    const imageUrl = storage.getFileView(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
        fileId
    ).toString();

    return {
        imageId: uploadRes.$id,
        imageUrl
    };
};

export const handleImageUrl = (url: string) => {
    return {
        imageId: generateUUID(),
        imageUrl: url.trim()
    };
};