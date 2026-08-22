import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdOutlineAddBox } from "react-icons/md";

const Navbar = () => {
	const { user } = useAuth();

	return (
		<nav className="bg-blue-800 p-4 flex justify-between items-center text-white">
			<Link to="/" className="text-2xl font-bold">
				BookStore
			</Link>
			<div className="flex items-center space-x-4">
				{user && (
					<Link
						to="/mybooks"
						className="bg-white hover:bg-blue-100 px-4 py-2 rounded-lg text-black"
					>
						My Books
					</Link>
				)}
				{user ? (
					<Link
						to="/logout"
						className="bg-white hover:bg-blue-100 px-4 py-2 rounded-lg text-black"
					>
						Logout
					</Link>
				) : (
					<Link
						to="/login"
						className="bg-white hover:bg-blue-100 px-4 py-2 rounded-lg text-black"
					>
						Login
					</Link>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
