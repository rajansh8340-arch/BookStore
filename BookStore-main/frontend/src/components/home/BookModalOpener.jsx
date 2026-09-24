import { useState } from "react";
import BookModal from "./BookModal";
import { BiShow } from "react-icons/bi";

const BookModalOpener = ({ book }) => {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setShowModal(true)}
				className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
				title="Quick Preview"
				aria-label="Quick Preview"
			>
				<BiShow className="text-2xl" />
			</button>
			{showModal && (
				<BookModal book={book} onClose={() => setShowModal(false)} />
			)}
		</>
	);
};

export default BookModalOpener;

