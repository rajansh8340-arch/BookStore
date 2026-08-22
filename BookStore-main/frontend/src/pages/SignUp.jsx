import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
	let nameRef = useRef();
	let emailRef = useRef();
	let passwordRef = useRef();

	const { setUser } = useAuth();
	let navigate = useNavigate();

	const signUpHandler = async (e) => {
		e.preventDefault();
		const name = nameRef.current.value;
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		try {
			let res = await axios.post(
				"https://bookstore-csp3.onrender.com/user/signup",
				{
					name,
					email,
					password,
				}
			);

			const { user, token } = res.data;

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			setUser(user);

			navigate("/");
		} catch (error) {
			console.log(error);
			console.log("Can't add user.");
		}
	};
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
				<h3 className="text-2xl font-bold text-center mb-6">Sign Up</h3>
				<form onSubmit={signUpHandler}>
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block text-gray-700 font-semibold mb-2"
						>
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							ref={nameRef}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
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
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
