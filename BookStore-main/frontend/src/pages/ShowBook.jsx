import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

const ShowBook = () => {
	const [book, setBook] = useState({});
	const [loading, setLoading] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		setLoading(true);
		axios
			.get(`https://bookstore-csp3.onrender.com/books/${id}`)
			.then((response) => {
				setBook(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	function generateCustomId(objectId) {
		if (objectId.length < 8) {
			return objectId.split("").reverse().join("");
		}
		const last4 = objectId.slice(-4);
		const next4AfterFirst4 = objectId.slice(4, 8);
		return `${next4AfterFirst4}${last4}`.toUpperCase();
	}

	const bookId = generateCustomId(id);

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			<BackButton />
			<h1 className="text-2xl font-semibold mb-4 text-center">Book Details</h1>
			{loading ? (
				<Spinner />
			) : (
				<div className="flex flex-col max-w-md mx-auto bg-white shadow-md rounded-lg p-4 border border-sky-400">
					<div className="mb-3">
						<span className="block text-lg font-medium text-gray-700 mb-1">
							Title
						</span>
						<span className="text-xl">{book.title}</span>
					</div>
					<div className="mb-3">
						<span className="block text-lg font-medium text-gray-700 mb-1">
							Author
						</span>
						<span className="text-xl">{book.author}</span>
					</div>
					<div className="mb-3">
						<span className="block text-lg font-medium text-gray-700 mb-1">
							Publish Year
						</span>
						<span className="text-xl">{book.publishYear}</span>
					</div>
					<div className="mb-3">
						<span className="block text-lg font-medium text-gray-700 mb-1">
							Description
						</span>
						<p className="text-xl">{book.description}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShowBook;
