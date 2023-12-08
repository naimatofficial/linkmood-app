import { Client, Storage, Account, Databases, Avatars } from "appwrite";

export const appwriteConfig = {
	url: import.meta.env.VITE_APPWIRTE_URL,
	projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
	storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
	databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
	userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
	postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
	savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
};

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
