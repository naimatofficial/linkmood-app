import { Client, Storage, Account, Databases, Avatars } from "appwrite";

export const appwriteConfig = {
	projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
	url: import.meta.env.VITE_APPWIRTE_URL,
};

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
