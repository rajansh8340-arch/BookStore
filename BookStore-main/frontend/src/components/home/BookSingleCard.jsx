// import { Link } from "react-router-dom";
// import { PiBookOpenTextLight } from "react-icons/pi";
// import { BiUserCircle, BiShow } from "react-icons/bi";
// import { AiOutlineEdit } from "react-icons/ai";
// import { BsInfoCircle } from "react-icons/bs";
// import { MdOutlineDelete } from "react-icons/md";
// import BookModalOpener from "./BookModalOpener";

// const BookSingleCard = ({ book }) => {
// 	return (
// 		<div className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl">
// 			<h2 className="absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg">
// 				{book.publishYear}
// 			</h2>
// 			<h4 className="my-2 text-gray-500">{book._id}</h4>
// 			<div className="flex justify-start items-center gap-x-2">
// 				<PiBookOpenTextLight className="text-red-300 text-2xl" />
// 				<h2 className="my-1">{book.title}</h2>
// 			</div>
// 			<div className="flex justify-start items-center gap-x-2">
// 				<BiUserCircle className="text-red-300 text-2xl" />
// 				<h2 className="my-1">{book.author}</h2>
// 			</div>
// 			<div className="flex justify-between items-center gap-x-2 mt-4 p-4">
// 				<BookModalOpener book={book} />
// 				<Link to={`/books/details/${book._id}`}>
// 					<BsInfoCircle className="text-2xl text-green-800 hover:text-black" />
// 				</Link>
// 				<Link to={`/books/edit/${book._id}`}>
// 					<AiOutlineEdit className="text-2xl text-yellow-600 hover:text-black" />
// 				</Link>
// 				<Link to={`/books/delete/${book._id}`}>
// 					<MdOutlineDelete className="text-2xl text-red-600 hover:text-black" />
// 				</Link>
// 			</div>
// 		</div>
// 	);
// };

// export default BookSingleCard;

import { Link } from "react-router-dom";
import { PiBookOpenTextLight } from "react-icons/pi";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import BookModalOpener from "./BookModalOpener";

const BookSingleCard = ({ book }) => {
	function generateCustomId(objectId) {
		if (objectId.length < 8) {
			return objectId.split("").reverse().join("");
		}
		const last4 = objectId.slice(-4);
		const next4AfterFirst4 = objectId.slice(4, 8);
		return `${next4AfterFirst4}${last4}`.toUpperCase();
	}

	const bookId = generateCustomId(book._id);

	return (
		<div className="border border-gray-500 rounded-lg px-4 py-4 m-4 bg-white hover:shadow-lg transition-shadow duration-300 ease-in-out relative overflow-hidden">
			{/* Publish Year Badge */}
			<h2 className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-bold shadow-md">
				{book.publishYear}
			</h2>

			{/* Book ID */}
			<h4 className="text-xs text-gray-400 mb-2 truncate">ID: {bookId}</h4>

			{/* Book Title */}
			<div className="flex items-center gap-3 mb-4">
				<PiBookOpenTextLight className="text-red-500 text-3xl" />
				<h2 className="text-xl font-semibold text-gray-800 truncate">
					{book.title}
				</h2>
			</div>

			{/* Book Author */}
			<div className="flex items-center gap-3 mb-6">
				<BiUserCircle className="text-red-500 text-3xl" />
				<h2 className="text-lg text-gray-700 truncate">{book.author}</h2>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-between items-center gap-x-2 border-t pt-4 mt-4">
				<div className="flex items-center gap-4">
					<BookModalOpener book={book} />
				</div>
				<Link
					to={`/books/details/${book._id}`}
					className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
				>
					<BsInfoCircle className="text-2xl" />
					<span className="hidden md:inline">Details</span>
				</Link>
				<Link
					to={`/books/edit/${book._id}`}
					className="flex items-center gap-2 text-yellow-600 hover:text-yellow-800 transition-colors"
				>
					<AiOutlineEdit className="text-2xl" />
					<span className="hidden md:inline">Edit</span>
				</Link>
				<Link
					to={`/books/delete/${book._id}`}
					className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
				>
					<MdOutlineDelete className="text-2xl" />
					<span className="hidden md:inline">Delete</span>
				</Link>
			</div>
		</div>
	);
};

export default BookSingleCard;
