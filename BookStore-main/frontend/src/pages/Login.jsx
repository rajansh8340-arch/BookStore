import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { useSnackbar } from "notistack";
import { BiLockAlt, BiEnvelope } from "react-icons/bi";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { enqueueSnackbar } = useSnackbar();

	const message = location.state?.message;

	const loginHandler = async (e) => {
		e.preventDefault();

		if (!email.trim() || !password) {
			enqueueSnackbar("Please fill in both email and password.", {
				variant: "warning",
			});
			return;
		}

		setLoading(true);

		try {
			const res = await apiClient.post("/user/login", {
				email: email.trim(),
				password,
			});

			const { user, token } = res.data;
			login(user, token);

			enqueueSnackbar(`Welcome back, ${user.name || user.email}!`, {
				variant: "success",
			});
			navigate("/");
		} catch (error) {
			console.error("Login error:", error);
			enqueueSnackbar(error.userMessage || "Invalid email or password.", {
				variant: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full bg-white p-8 sm:p-10 shadow-xl rounded-2xl border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
						Welcome Back
					</h2>
					<p className="text-sm text-gray-500 mt-2">
						Sign in to manage your collection and favorites
					</p>
				</div>

				{message && (
					<div className="mb-6 p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-800 text-sm rounded-r-lg">
						{message}
					</div>
				)}

				<form onSubmit={loginHandler} className="space-y-5">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-semibold text-gray-700 mb-1.5"
						>
							Email Address
						</label>
						<div className="relative">
							<BiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
								className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-semibold text-gray-700 mb-1.5"
						>
							Password
						</label>
						<div className="relative">
							<BiLockAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
					>
						{loading ? (
							<>
								<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
								<span>Signing In...</span>
							</>
						) : (
							<span>Sign In</span>
						)}
					</button>

					<div className="text-center pt-4 border-t border-gray-100">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-sky-600 hover:text-sky-800 font-semibold hover:underline"
							>
								Create an account
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;

