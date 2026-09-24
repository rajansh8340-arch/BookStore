import BookSingleCard from "./BookSingleCard";

const BooksCard = ({ books = [], onBookUpdated }) => {
	if (!books || books.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{books.map((item) => (
				<BookSingleCard
					key={item._id}
					book={item}
					onBookUpdated={onBookUpdated}
				/>
			))}
		</div>
	);
};

export default BooksCard;
