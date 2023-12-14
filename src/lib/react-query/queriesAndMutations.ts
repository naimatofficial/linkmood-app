import { INewPost, INewUser } from "@/types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
	createPost,
	createUserAccount,
	getRecentPosts,
	signInAccount,
	signOutAccount,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

const queryClient = new QueryClient();

export const useCreateUserAccount = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
};

export const useSignInAccount = () => {
	return useMutation({
		mutationFn: (user: { email: string; password: string }) =>
			signInAccount(user),
	});
};

export const useSignOutAccount = () => {
	return useMutation({
		mutationFn: signOutAccount,
	});
};

export const useCreatePost = (post: INewPost) => {
	return useMutation({
		mutationFn: () => createPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useGetRecentPosts = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POSTS],
		queryFn: () => getRecentPosts(),
	});
};
