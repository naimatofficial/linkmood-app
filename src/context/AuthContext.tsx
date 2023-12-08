import { createContext, ReactNode, useEffect, useState } from "react";

import { IContextType, IUser } from "@/types";

const INITIAL_USER = {
	name: "",
	email: "",
	username: "",
	password: "",
	bio: "",
	imageUrl: "",
};

const INITIAL_STATE = {
	user: INITIAL_USER,
	isLoading: false,
	isAuthenticated: false,
	setUser: () => {},
	setIsAuthenticated: () => {},
	checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser>(INITIAL_USER);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const checkAuthUser = async () => {
		try {
			// const currentAccount = await getCurrentUser();
		} catch (error) {
			console.error(error);
		}
	};

	const value = {
		user,
		setUser,
		isLoading,
		isAuthenticated,
		setIsAuthenticated,
		checkAuthUser,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
