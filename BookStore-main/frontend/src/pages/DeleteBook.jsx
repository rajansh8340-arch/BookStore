import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const DeleteBook = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const handleDeleteBook = () => {
		setLoading(true);
		axios
			.delete(`https://bookstore-csp3.onrender.com/books/${id}`)
			.then(() => {
				setLoading(false);
				enqueueSnackbar("Book Deleted successfully", { variant: "success" });
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
			<h1 className="text-2xl font-semibold mb-6 text-center">Delete Book</h1>
			{loading ? (
				<Spinner />
			) : (
				<div className="flex flex-col items-center max-w-md mx-auto bg-white shadow-md border border-sky-400 rounded-lg p-6">
					<h3 className="text-xl font-medium mb-4 text-center">
						Are you sure you want to delete this book?
					</h3>
					<div className="flex gap-4">
						<button
							className="bg-red-600 text-white py-3 px-4 rounded-lg w-full hover:bg-red-700 transition-colors"
							onClick={handleDeleteBook}
						>
							Delete
						</button>
						<button
							className="bg-gray-300 text-gray-700 py-3 px-4 rounded-lg w-full hover:bg-gray-400 transition-colors"
							onClick={() => {
								navigate(-1);
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeleteBook;
