import { ID, Query } from "appwrite";

import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export const createUserAccount = async (user: INewUser) => {
	try {
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
		console.log(post);
		const uploadedFile = await uploadFile(post.file[0]);

		console.log(uploadFile);

		if (!uploadedFile) throw Error;

		// Get file url
		const fileUrl = getFilePreview(uploadedFile.$id);
		if (!fileUrl) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		console.log(fileUrl);

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
		console.log(newPost);

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

export const getRecentPosts = async () => {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.orderDesc("$createdAt"), Query.limit(20)]
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.log(error);
	}
};

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

export async function likePost(postId: string, likesArray: string[]) {
	try {
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function savePost(postId: string, userId: string) {
	try {
		const savePost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			ID.unique(),
			{
				user: userId,
				post: postId,
			}
		);

		if (!savePost) throw Error;

		return savePost;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteSavePost(savedRecordId: string) {
	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			savedRecordId
		);

		if (!statusCode) throw Error;

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

export async function getPostById(postId: string) {
	try {
		const post = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId
		);

		if (!post) throw Error;

		return post;
	} catch (error) {
		console.log(error);
	}
}

// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
	const hasFileToUpdate = post.file.length > 0;

	try {
		let image = {
			imageUrl: post.imageUrl,
			imageId: post.imageId,
		};

		if (hasFileToUpdate) {
			// Upload new file to appwrite storage
			const uploadedFile = await uploadFile(post.file[0]);
			if (!uploadedFile) throw Error;

			// Get new file url
			const fileUrl = getFilePreview(uploadedFile.$id);
			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = {
				...image,
				imageUrl: fileUrl,
				imageId: uploadedFile.$id,
			};
		}

		// Convert tags into array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		console.log(post);
		//  Update post
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			post.postId,
			{
				caption: post.caption,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
				location: post.location,
				tags: tags,
			}
		);

		console.log(updatedPost);

		// Failed to update
		if (!updatedPost) {
			// Delete new file that has been recently uploaded
			if (hasFileToUpdate) {
				await deleteFile(image.imageId);
			}

			// If no new file uploaded, just throw error
			throw Error;
		}

		// Safely delete old file after successful update
		if (hasFileToUpdate) {
			await deleteFile(post.imageId);
		}

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
	if (!postId || !imageId) return;

	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId
		);

		if (!statusCode) throw Error;

		await deleteFile(imageId);

		return { status: "Ok" };
	} catch (error) {
		console.log(error);
	}
}
