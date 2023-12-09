import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
	const navigate = useNavigate();
	const { user } = useUserContext();
	const { pathname } = useLocation();

	const { mutate: signOut, isSuccess } = useSignOutAccount();

	useEffect(() => {
		// if sign out success then navigate the sign in page
		if (isSuccess) navigate(0);
	}, [isSuccess]);

	return (
		<nav className="leftsidebar">
			<div className="flex flex-col gap-11">
				<Link to="/" className="flex gap-3 items-center">
					<img
						src="/assets/images/logo.svg"
						alt="logo"
						width={170}
						height={360}
					/>
				</Link>

				<Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
					<img
						src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
						alt="profile"
						className="h-14 w-14 rounded-full"
					/>
					<div className="flex flex-col">
						<p className="body-bold">{user.name}</p>
						<p className="text-light-3 small-regular">@{user.username}</p>
					</div>
				</Link>

				{/* Side bar links */}
				<ul className="flex flex-col gap-6">
					{sidebarLinks.map((link: INavLink) => {
						const isActive = pathname === link.route;

						return (
							<li
								key={link.label}
								className={`leftsidebar-link group ${
									isActive && "bg-primary-500"
								}`}
							>
								<NavLink
									to={link.route}
									className="flex gap-4 items-center p-4"
								>
									<img
										src={link.imgURL}
										alt={link.label}
										className={`group-hover:invert-white ${
											isActive && "invert-white"
										}`}
									/>
									{link.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</div>

			<Button
				variant={"ghost"}
				className="shad-button_ghost leftsidebar-link"
				onClick={() => signOut()}
			>
				<img src="/assets/icons/logout.svg" alt="logout" />
				<p className="small-medium lg:base-medium">Logout</p>
			</Button>
		</nav>
	);
};

export default LeftSidebar;
