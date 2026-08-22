import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateBooks from "./pages/CreateBooks";
import ShowBook from "./pages/ShowBook";
import EditBook from "./pages/EditBook";
import DeleteBook from "./pages/DeleteBook";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import { AuthProvider } from "./context/AuthContext";
import MyBooks from "./pages/MyBooks";

const App = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<AuthProvider>
				<Navbar />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/books/create" element={<CreateBooks />} />
						<Route path="/books/details/:id" element={<ShowBook />} />
						<Route path="/books/edit/:id" element={<EditBook />} />
						<Route path="/books/delete/:id" element={<DeleteBook />} />
						<Route path="/mybooks" element={<MyBooks />} />
					</Routes>
				</main>
			</AuthProvider>
		</div>
	);
};

export default App;
