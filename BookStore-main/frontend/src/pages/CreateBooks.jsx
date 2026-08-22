import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateBooks = () => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [publishYear, setPublishYear] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const handleSaveBook = () => {
		const data = {
			title,
			author,
			publishYear,
			description,
		};
		const token = localStorage.getItem("token");
		// const user = localStorage.getItem("user");
		setLoading(true);
		axios
			.post("https://bookstore-csp3.onrender.com/books", data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then(() => {
				setLoading(false);
				enqueueSnackbar("Book Created successfully", { variant: "success" });
				navigate("/");
			})
			.catch((error) => {
				setLoading(false);
				enqueueSnackbar("Error", { variant: "error" });
				console.log(error);
			});
	};

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<BackButton />
			<h1 className="text-3xl font-semibold my-4 text-center">Create Book</h1>
			{loading && <Spinner />}
			<div className="flex flex-col max-w-lg mx-auto bg-white shadow-md rounded-lg p-4 border border-sky-400">
				<div className="mb-4">
					<label className="block text-lg font-medium text-gray-700 mb-1">
						Title
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-lg font-medium text-gray-700 mb-1">
						Author
					</label>
					<input
						type="text"
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-lg font-medium text-gray-700 mb-1">
						Publish Year
					</label>
					<input
						type="number"
						value={publishYear}
						onChange={(e) => setPublishYear(e.target.value)}
						className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-lg font-medium text-gray-700 mb-1">
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="border border-gray-300 rounded-lg px-3 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
					/>
				</div>
				<button
					className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
					onClick={handleSaveBook}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default CreateBooks;
