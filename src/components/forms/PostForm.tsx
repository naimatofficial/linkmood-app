import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
	useCreatePost,
	useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";

type PostFormProps = {
	post?: Models.Document;
	action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
	const { user } = useUserContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	const { mutateAsync: createPost, isPending: isLoadingCreate } =
		useCreatePost();
	const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
		useUpdatePost();

	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			caption: post ? post?.caption : "",
			file: [],
			location: post ? post?.location : "",
			tags: post ? post?.tags?.join(",") : "",
		},
	});

	function onSubmit(values: z.infer<typeof PostValidation>) {
		if (post && action === "Update") {
			// Update the post
			const updatedPost = updatePost({
				...values,
				postId: post.$id,
				imageId: post.imageId,
				imageUrl: post.imageUrl,
			});

			console.log(updatedPost);

			if (!updatedPost) {
				return toast({
					title: "Please try agian.",
				});
			}

			return navigate(`/posts/${post.$id}`);
		}

		// Create a new post
		const newPost = createPost({
			...values,
			userId: user?.id,
		});

		if (!newPost) {
			return toast({
				title: "Please try agian.",
			});
		}

		navigate("/");
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-9 w-full max-w-5xl"
			>
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Caption</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									className="shad-textarea custom-scrollbar"
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Photo</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post?.imageUrl}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Location</FormLabel>
							<FormControl>
								<Input type="text" className="shad-input" {...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">
								Add Tags (seprated by comma " , ")
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="shad-input"
									placeholder="ART, Gaming, Sports, ..."
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<div className="flex justify-end items-center gap-4">
					<Button type="button" className="shad-button_dark_4">
						Cancel
					</Button>
					<Button
						type="submit"
						className="shad-button_primary whitespace-nowrap"
						disabled={isLoadingCreate || isLoadingUpdate}
					>
						{(isLoadingCreate || isLoadingUpdate) && "Loading..."}
						{action} Post
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PostForm;
