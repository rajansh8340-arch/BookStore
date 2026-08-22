import axios from "axios";
import React, { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const emailRef = useRef();
	const passwordRef = useRef();

	const { setUser } = useAuth();
	let navigate = useNavigate();

	const location = useLocation();
	const message = location.state?.message;

	const loginHandler = async (e) => {
		e.preventDefault();
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		try {
			const res = await axios.post(
				"https://bookstore-csp3.onrender.com/user/login",
				{
					email,
					password,
				}
			);

			const { user, token } = res.data;

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			setUser(user);

			// setUser(res.data);
			// console.log(res.data);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
				<h3 className="text-2xl font-bold text-center mb-6">Login</h3>
				{message && <p className="text-red-500 mb-4">{message}</p>}
				<form onSubmit={loginHandler}>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-gray-700 font-semibold mb-2"
						>
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							ref={emailRef}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="pw"
							className="block text-gray-700 font-semibold mb-2"
						>
							Password
						</label>
						<input
							id="pw"
							name="password"
							type="password"
							ref={passwordRef}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
					>
						Login
					</button>
					<div className="mt-4 text-center">
						<p className="text-gray-700">
							New user?
							<Link to="/signup" className="text-blue-500 hover:underline ml-2">
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
