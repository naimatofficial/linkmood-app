import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Routes, Route } from "react-router-dom";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import {
	AllUsers,
	CreatePost,
	Explore,
	Home,
	LikedPosts,
	PostDetails,
	Profile,
	Saved,
	UpdateProfile,
} from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import EditPost from "./_root/pages/EditPost";

const App = () => {
	return (
		<main className="flex h-screen">
			<Routes>
				{/* Public Routes */}
				<Route element={<AuthLayout />}>
					<Route path="/sign-in" element={<SigninForm />} />
					<Route path="/sign-up" element={<SignupForm />} />
				</Route>

				{/* Private Routes */}
				<Route element={<RootLayout />}>
					<Route index element={<Home />} />
					<Route path="/explore" element={<Explore />} />
					<Route path="/all-users" element={<AllUsers />} />
					<Route path="/create-post" element={<CreatePost />} />
					<Route path="/posts/:id" element={<PostDetails />} />
					<Route path="/edit-post" element={<EditPost />} />
					<Route path="/liked-post" element={<LikedPosts />} />
					<Route path="/saved" element={<Saved />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/update-profile" element={<UpdateProfile />} />
				</Route>
			</Routes>

			<Toaster />
		</main>
	);
};

export default App;
