import { Link, useLocation } from "react-router-dom";
import { INavLink } from "@/types";
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
	const { pathname } = useLocation();
	return (
		<section className="bottom-bar">
			{bottombarLinks.map((link: INavLink) => {
				const isActive = pathname === link.route;

				return (
					<Link
						key={link.label}
						to={link.route}
						className={`${
							isActive && "bg-primary-500"
						} flex-center flex-col gap-1 p-2 transition ease-in rounded-[10px] `}
					>
						<img
							src={link.imgURL}
							alt={link.label}
							width={16}
							height={16}
							className={`group-hover:invert-white ${
								isActive && "invert-white"
							}`}
						/>
						<p className="tiny-medium text-light-2">{link.label}</p>
					</Link>
				);
			})}
		</section>
	);
};

export default Bottombar;
