import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditBook = () => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [publishYear, setPublishYear] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`https://bookstore-csp3.onrender.com/books/${id}`)
			.then((response) => {
				setAuthor(response.data.author);
				setPublishYear(response.data.publishYear);
				setTitle(response.data.title);
				setDescription(response.data.description);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				alert("An error happened. Please check console");
				console.log(error);
			});
	}, []);

	const handleEditBook = () => {
		const data = {
			title,
			author,
			publishYear,
			description,
		};
		setLoading(true);
		axios
			.put(`https://bookstore-csp3.onrender.com/books/${id}`, data)
			.then(() => {
				setLoading(false);
				enqueueSnackbar("Book Edited successfully", { variant: "success" });
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
			<h1 className="text-2xl font-semibold mb-4 text-center">Edit Book</h1>
			{loading ? (
				<Spinner />
			) : (
				<div className="flex flex-col max-w-md mx-auto bg-white shadow-md rounded-lg p-6 border border-sky-400">
					<div className="mb-4">
						<label className="block text-lg font-medium text-gray-700 mb-1">
							Title
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="border border-gray-300 rounded-md px-4 py-2 w-full"
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
							className="border border-gray-300 rounded-md px-4 py-2 w-full"
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
							className="border border-gray-300 rounded-md px-4 py-2 w-full"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-lg font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="border border-gray-300 rounded-md px-4 py-2 w-full"
						/>
					</div>
					<button
						className="w-full bg-sky-300 text-white py-2 rounded-lg hover:bg-sky-400 transition-colors"
						onClick={handleEditBook}
					>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default EditBook;
