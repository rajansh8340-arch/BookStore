import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import BooksTable from "../components/home/BooksTable";

const Home = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	// const [showType, setShowType] = useState("table");

	const user = JSON.parse(localStorage.getItem("user"));
	// console.log(user);

	useEffect(() => {
		setLoading(true);
		axios
			.get("https://bookstore-csp3.onrender.com/books")
			.then((response) => {
				setBooks(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, []);

	let navigate = useNavigate();

	const handleCreateBookClick = () => {
		if (user) {
			navigate("/books/create");
		} else {
			navigate("/login", {
				state: { message: "You need to log in to post a book" },
			});
		}
	};

	return (
		<div className="p-4">
			{/* <div className="flex justify-center items-center gap-x-4">
				<button
					className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
					onClick={() => setShowType("table")}
				>
					Table
				</button>
				<button
					className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
					onClick={() => setShowType("card")}
				>
					Card
				</button>
			</div> */}
			<div className="flex flex-col items-center relative mb-12">
				<h1 className="text-3xl my-4 font-semibold">Books List</h1>
				<div
					onClick={handleCreateBookClick}
					className="absolute bottom-[-30px] right-0 cursor-pointer"
				>
					<MdOutlineAddBox className="text-sky-800 text-4xl" />
				</div>
			</div>

			{/* {loading ? (
				<Spinner />
			) : showType === "table" ? (
				<BooksTable books={books} />
			) : (
				<BooksCard books={books} />
			)} */}
			{loading ? <Spinner /> : <BooksTable books={books} />}
		</div>
	);
};

export default Home;
