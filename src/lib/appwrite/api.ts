import { ID, Query } from "appwrite";

import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export const createUserAccount = async (user: INewUser) => {
	try {
		console.log(user);

		// Auth a user using appwrite
		const newAccount = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

		// if user does not create throw an error
		if (!newAccount) throw Error;

		// get the avatar url according to user name
		const avatarUrl = avatars.getInitials(user.name);

		// save a user information to database
		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
			imageUrl: avatarUrl,
		});

		return newUser;
	} catch (error) {
		console.error(error);
	}
};

export const saveUserToDB = async (user: {
	accountId: string;
	name: string;
	email: string;
	imageUrl: URL;
	username?: string;
}) => {
	try {
		// Create a new user in User's Collection
		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			user
		);

		return newUser;
	} catch (error) {
		console.error(error);
	}
};

export const signInAccount = async (user: {
	email: string;
	password: string;
}) => {
	try {
		const session = await account.createEmailSession(user.email, user.password);

		// if (!session) throw Error;
		return session;
	} catch (error) {
		console.error(error);
	}
};

export const getAccount = async () => {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		return currentAccount;
	} catch (error) {
		console.error(error);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await getAccount();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		console.log("current user", currentUser);

		return currentUser.documents[0];
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const signOutAccount = async () => {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (error) {
		console.error(error);
	}
};

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
	try {
		// Upload file to appwrite storage
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) throw Error;

		// Get file url
		const fileUrl = getFilePreview(uploadedFile.$id);
		if (!fileUrl) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		// Convert tags into array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		// Create post
		const newPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				imageUrl: fileUrl,
				imageId: uploadedFile.$id,
				location: post.location,
				tags: tags,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		return newPost;
	} catch (error) {
		console.log(error);
	}
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
	try {
		const uploadedFile = await storage.createFile(
			appwriteConfig.storageId,
			ID.unique(),
			file
		);

		return uploadedFile;
	} catch (error) {
		console.log(error);
	}
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
	try {
		const fileUrl = storage.getFilePreview(
			appwriteConfig.storageId,
			fileId,
			2000, // width
			2000, // height
			"top", // gravity
			100 // quality
		);

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error) {
		console.log(error);
	}
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
	try {
		await storage.deleteFile(appwriteConfig.storageId, fileId);

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.search("caption", searchTerm)]
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.log(error);
	}
}
