import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { MdOutlineAddBox } from "react-icons/md";
import BooksCard from "../components/home/BooksCard";
import { useNavigate } from "react-router-dom";

const MyBooks = () => {
	const [books, setBooks] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const token = localStorage.getItem("token");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await axios.get(
					"https://bookstore-csp3.onrender.com/books/mybooks",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setBooks(response.data);
			} catch (error) {
				console.log(error);
				enqueueSnackbar("Error fetching books", { variant: "error" });
			}
		};

		if (token) {
			fetchBooks();
		} else {
			enqueueSnackbar("You need to log in to see your books", {
				variant: "warning",
			});
		}
	}, [token, enqueueSnackbar]);

	const handleCreateBookClick = () => {
		navigate("/books/create");
	};

	return (
		<div className="p-4">
			<div className="relative flex justify-center items-center">
				<h1 className="text-3xl my-4 font-semibold">My Books</h1>
				<div
					onClick={handleCreateBookClick}
					className="absolute right-0 bottom-[-24px] cursor-pointer"
				>
					<MdOutlineAddBox className="text-sky-800 text-4xl" />
				</div>
			</div>
			<div>
				{books.length === 0 ? (
					<p>There are no books yet.</p>
				) : (
					<div className="p-4">
						<BooksCard books={books} />
					</div>
					// <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					// 	{/* {books.map((book) => (
					// 		<div key={book._id} className="border p-4 rounded-lg shadow">
					// 			<h2 className="text-xl font-bold">{book.title}</h2>
					// 			<p>Author: {book.author}</p>
					// 			<p>Year: {book.publishYear}</p>
					// 			<p>{book.description}</p> */}
					// 	{/* <Link to={`/books/details/${book._id}`} className="text-blue-500">
					// 				View Details
					// 			</Link> */}
					// 	{/* <div className="flex gap-x-4 mt-2">
					// 				<BookModalOpener book={book} />
					// 				<Link to={`/books/edit/${book._id}`}>
					// 					<AiOutlineEdit className="text-2xl text-yellow-600" />
					// 				</Link>
					// 				<Link to={`/books/delete/${book._id}`}>
					// 					<MdOutlineDelete className="text-2xl text-red-600" />
					// 				</Link>
					// 			</div>
					// 		</div>
					// 	))} */}

					// </div>
				)}
			</div>
		</div>
	);
};

export default MyBooks;
