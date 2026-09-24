import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import { BiLogOut } from "react-icons/bi";

const Logout = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const handleLogout = () => {
		logout();
		enqueueSnackbar("You have been logged out successfully.", {
			variant: "info",
		});
		navigate("/");
	};

	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 py-12 px-4">
			<div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center">
				<div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
					<BiLogOut />
				</div>
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Confirm Sign Out
				</h2>
				<p className="text-sm text-gray-500 mb-6">
					Are you sure you want to log out of your account?
				</p>
				<div className="flex gap-3 justify-center">
					<button
						type="button"
						onClick={handleCancel}
						className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-all"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleLogout}
						className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default Logout;

