import { useState } from "react";
import BookModal from "./BookModal";
import { BiShow } from "react-icons/bi";

const BookModalOpener = ({ book }) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<BiShow
				className="text-3xl text-blue-800 hover:text-black cursor-pointer"
				onClick={() => setShowModal(true)}
			/>
			{showModal && (
				<BookModal book={book} onClose={() => setShowModal(false)} />
			)}
		</>
	);
};

export default BookModalOpener;
