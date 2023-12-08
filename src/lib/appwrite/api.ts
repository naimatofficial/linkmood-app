import { ID } from "appwrite";

import { INewUser } from "@/types";
import { account } from "./config";

export const createUserAccount = async (user: INewUser) => {
	try {
		console.log(user);
		const newUser = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

		console.log(newUser);

		return newUser;
	} catch (error) {
		console.error(error);
	}
};
