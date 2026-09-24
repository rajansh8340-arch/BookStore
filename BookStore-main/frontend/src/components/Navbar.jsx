import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BiBookOpen, BiUser } from "react-icons/bi";
import { MdOutlineAddBox } from "react-icons/md";

const Navbar = () => {
	const { user } = useAuth();
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<header className="bg-gradient-to-r from-sky-800 to-indigo-900 shadow-md text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
				<Link
					to="/"
					className="flex items-center gap-2 text-2xl font-extrabold tracking-tight hover:text-sky-200 transition-colors"
				>
					<BiBookOpen className="text-3xl text-sky-300" />
					<span>BookStore</span>
				</Link>

				<nav className="flex items-center space-x-3 sm:space-x-4">
					<Link
						to="/"
						className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
							isActive("/")
								? "bg-white/20 text-white"
								: "text-sky-100 hover:bg-white/10 hover:text-white"
						}`}
					>
						Explore
					</Link>

					{user && (
						<>
							<Link
								to="/mybooks"
								className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
									isActive("/mybooks")
										? "bg-white/20 text-white"
										: "text-sky-100 hover:bg-white/10 hover:text-white"
								}`}
							>
								My Books
							</Link>
							<Link
								to="/books/create"
								className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
							>
								<MdOutlineAddBox className="text-lg" />
								<span className="hidden sm:inline">Add Book</span>
							</Link>
						</>
					)}

					{user ? (
						<div className="flex items-center gap-3 pl-2 border-l border-white/20">
							<span className="hidden md:flex items-center gap-1.5 text-xs text-sky-200 bg-white/10 px-2.5 py-1 rounded-full">
								<BiUser className="text-sm" />
								<span className="max-w-[120px] truncate font-medium">
									{user.name || user.email}
								</span>
							</span>
							<Link
								to="/logout"
								className="bg-red-500/90 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
							>
								Logout
							</Link>
						</div>
					) : (
						<div className="flex items-center gap-2 pl-2">
							<Link
								to="/login"
								className="bg-white text-sky-900 hover:bg-sky-50 font-semibold px-3.5 py-1.5 rounded-lg text-sm shadow-sm transition-all"
							>
								Login
							</Link>
							<Link
								to="/signup"
								className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-sm shadow-sm transition-all hidden sm:inline-block"
							>
								Sign Up
							</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Navbar;

