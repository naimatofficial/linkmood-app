import { useToast } from "@/components/ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
	useCreateUserAccount,
	useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { mutateAsync: createUserAccount, isPending: isUserCreating } =
		useCreateUserAccount();
	const { mutateAsync: signInAccount, isPending: isSigningIn } =
		useSignInAccount();
	const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof SignupValidation>) {
		// create new user
		const newAccount = await createUserAccount(values);

		if (!newAccount) {
			return toast({
				title: "Sign up failed!, Please try agian.",
			});
		}

		const session = await signInAccount({
			email: values.email,
			password: values.password,
		});

		if (!session) {
			return toast({
				title: "Sign in failed!, Please try agian.",
			});
		}

		const isLoggedIn = await checkAuthUser();

		if (isLoggedIn) {
			form.reset();

			navigate("/");
		} else {
			toast({
				title: "Sign up failed!, Please try agian.",
			});
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img src="/assets/images/logo.svg" alt="logo" />
				<h2 className="h3-bold sm:h2-bold pt-5 sm:pt-12">
					Create a new account
				</h2>
				<p className="text-light-3 small-medium md:base-regular">
					To use lightmood, please enter your details.
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col w-full gap-5 mt-4 "
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="text" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input type="text" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="text" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" className="shad-input" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary ">
						{isUserCreating ? (
							<div className="flex-center gap-2">
								<Loader /> Loading...
							</div>
						) : (
							"Sign Up"
						)}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
						Already have an account?
						<Link
							to="/sign-in"
							className="text-primary-500 text-small-semibold ml-1"
						>
							Log in
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SignupForm;
