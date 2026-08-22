import { AiOutlineClose } from "react-icons/ai";
import { PiBookOpenTextLight } from "react-icons/pi";
import { BiUserCircle } from "react-icons/bi";

const BookModal = ({ book, onClose }) => {
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
		// <div
		// 	className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
		// 	onClick={onClose}
		// >
		// 	<div
		// 		onClick={(event) => event.stopPropagation()}
		// 		className="w-[600px] max-w-full h-[400px] bg-white rounded-xl p-4 flex flex-col relative"
		// 	>
		// 		<AiOutlineClose
		// 			className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer"
		// 			onClick={onClose}
		// 		/>
		// 		<h2 className="w-fit px-4 py-1 bg-red-300 rounded-lg">
		// 			{book.publishYear}
		// 		</h2>
		// 		<h4 className="my-2 text-gray-500">{bookId}</h4>
		// 		<div className="flex justify-start items-center gap-x-2">
		// 			<PiBookOpenTextLight className="text-red-300 text-2xl" />
		// 			<h2 className="my-1">{book.title}</h2>
		// 		</div>
		// 		<div className="flex justify-start items-center gap-x-2">
		// 			<BiUserCircle className="text-red-300 text-2xl" />
		// 			<h2 className="my-1">{book.author}</h2>
		// 		</div>
		// 		<p className="mt-4">Description</p>
		// 		<p className="my-2">{book.description}</p>
		// 	</div>
		// </div>
		<div
			className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className="w-full max-w-4xl h-auto bg-white rounded-lg p-6 flex flex-col relative shadow-lg"
			>
				<AiOutlineClose
					className="absolute top-4 right-4 text-2xl text-red-600 cursor-pointer"
					onClick={onClose}
				/>
				<div className="flex items-center justify-between mb-4 mt-2 mr-4">
					<h2 className="text-xl font-bold bg-red-300 text-white px-3 py-1 rounded-lg">
						{book.publishYear}
					</h2>
					<h4 className="text-gray-500 text-lg">{bookId}</h4>
				</div>
				<div className="flex items-center gap-4 mb-4">
					<PiBookOpenTextLight className="text-red-300 text-3xl" />
					<h2 className="text-2xl font-semibold">{book.title}</h2>
				</div>
				<div className="flex items-center gap-4 mb-4">
					<BiUserCircle className="text-red-300 text-3xl" />
					<h2 className="text-xl">{book.author}</h2>
				</div>
				<div>
					<p className="text-lg font-semibold mb-2">Description</p>
					<p className="text-gray-700">{book.description}</p>
				</div>
			</div>
		</div>
	);
};

export default BookModal;
