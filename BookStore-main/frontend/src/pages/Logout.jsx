import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		navigate("/");
	};

	const handleCancel = () => {
		navigate("/");
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-4">
				<h1 className="text-xl font-semibold mb-6 text-center">
					Are you sure you want to log out?
				</h1>
				<div className="flex gap-4 justify-center">
					<button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
					>
						Yes, Logout
					</button>
					<button
						onClick={handleCancel}
						className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default Logout;
