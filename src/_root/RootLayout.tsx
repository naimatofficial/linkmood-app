import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Loader from "@/components/shared/Loader";
import Topbar from "@/components/shared/Topbar";
import { useUserContext } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	const { isLoading } = useUserContext();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<Loader />
			</div>
		);
	}

	return (
		<div className={`w-full md:flex`}>
			<Topbar />
			<LeftSidebar />

			<section className="flex flex-1 h-screen">
				<Outlet />
			</section>

			<Bottombar />
		</div>
	);
};

export default RootLayout;
