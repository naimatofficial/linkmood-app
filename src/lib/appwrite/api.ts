import { ID, Query } from "appwrite";

import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";

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
