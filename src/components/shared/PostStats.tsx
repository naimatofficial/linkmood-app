import React, { useState, useEffect } from "react";
import { Models } from "appwrite";
import {
	useDeleteSavedPost,
	useGetCurrentUser,
	useLikePost,
	useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";

type PostStatsProps = {
	post: Models.Document;
	userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
	const likesList = post.likes.map((user: Models.Document) => user.$id);

	const [likes, setLikes] = useState(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const { mutate: likePost } = useLikePost();
	const { mutate: savedPost, isPending: isSavingPost } = useSavePost();
	const { mutate: deleteSavedPost, isPending: isDeletingPost } =
		useDeleteSavedPost();

	const { data: currentUser } = useGetCurrentUser();

	const savePostRecord = currentUser?.save.find(
		(record: Models.Document) => record.post.$id === post.$id
	);

	useEffect(() => {
		setIsSaved(!!savePostRecord);
	}, [currentUser, savePostRecord]);

	const handleLikePost = (e: React.MouseEvent) => {
		e.stopPropagation();

		let newLikes = [...likes];

		const hasLiked = newLikes.includes(userId);

		if (hasLiked) {
			newLikes = newLikes.filter((id) => id !== userId);
		} else {
			newLikes.push(userId);
		}

		setLikes(newLikes);
		likePost({ postId: post.$id, likesArray: newLikes });
	};

	const handleSavedPost = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (savePostRecord) {
			setIsSaved(false);
			deleteSavedPost(savePostRecord.$id);
		} else {
			savedPost({ postId: post.$id, userId });
			setIsSaved(true);
		}
	};

	return (
		<div className="flex justify-between items-center z-20">
			<div className="flex gap-2 mr-5">
				<img
					src={
						checkIsLiked(likes, userId)
							? "/assets/icons/liked.svg"
							: "/assets/icons/like.svg"
					}
					alt="like"
					width={20}
					height={20}
					className="cursor-pointer transition-all ease-in-out"
					onClick={handleLikePost}
				/>
				<p className={`small-medium lg:base-medium`}>{likes.length}</p>
			</div>
			<div className="mr-5">
				{isSavingPost || isDeletingPost ? (
					<Loader />
				) : (
					<img
						src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
						alt="like"
						width={20}
						height={20}
						className="cursor-pointer"
						onClick={handleSavedPost}
					/>
				)}
			</div>
		</div>
	);
};

export default PostStats;
