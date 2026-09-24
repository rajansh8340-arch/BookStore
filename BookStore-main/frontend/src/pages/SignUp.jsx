import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { useSnackbar } from "notistack";
import { BiUser, BiEnvelope, BiLockAlt } from "react-icons/bi";

const SignUp = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const signUpHandler = async (e) => {
		e.preventDefault();

		if (!name.trim() || !email.trim() || !password) {
			enqueueSnackbar("Please fill in all required fields.", {
				variant: "warning",
			});
			return;
		}

		if (password.length < 4) {
			enqueueSnackbar("Password must be at least 4 characters long.", {
				variant: "warning",
			});
			return;
		}

		setLoading(true);

		try {
			const res = await apiClient.post("/user/signup", {
				name: name.trim(),
				email: email.trim(),
				password,
			});

			const { user, token } = res.data;
			login(user, token);

			enqueueSnackbar("Account created successfully! Welcome aboard.", {
				variant: "success",
			});
			navigate("/");
		} catch (error) {
			console.error("SignUp error:", error);
			enqueueSnackbar(
				error.userMessage || "Failed to create account. Please try again.",
				{ variant: "error" }
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full bg-white p-8 sm:p-10 shadow-xl rounded-2xl border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
						Create an Account
					</h2>
					<p className="text-sm text-gray-500 mt-2">
						Join our bookstore to track and share your favorite books
					</p>
				</div>

				<form onSubmit={signUpHandler} className="space-y-5">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-semibold text-gray-700 mb-1.5"
						>
							Full Name
						</label>
						<div className="relative">
							<BiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
							<input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Jane Doe"
								required
								className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
							/>
						</div>
					</div>

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
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="At least 4 characters"
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
								<span>Creating Account...</span>
							</>
						) : (
							<span>Create Account</span>
						)}
					</button>

					<div className="text-center pt-4 border-t border-gray-100">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-sky-600 hover:text-sky-800 font-semibold hover:underline"
							>
								Sign In
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;

