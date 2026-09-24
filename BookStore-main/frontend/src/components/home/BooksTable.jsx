import { useState } from "react";
import { Link } from "react-router-dom";
import { BsInfoCircle, BsStarFill } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { PiBookBookmarkFill } from "react-icons/pi";
import RatingStars from "../RatingStars";
import RateBookModal from "../RateBookModal";
import TwoPageBookReader from "../TwoPageBookReader";

const BooksTable = ({ books = [], onBookUpdated }) => {
	const [activeBookForReader, setActiveBookForReader] = useState(null);
	const [activeBookForRating, setActiveBookForRating] = useState(null);

	if (!books || books.length === 0) {
		return null;
	}

	return (
		<>
			<div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-sky-50/70 border-b border-gray-200 text-sky-900 text-xs uppercase font-bold tracking-wider">
							<th className="py-4 px-4 text-center w-12">#</th>
							<th className="py-4 px-4">Title & Author</th>
							<th className="py-4 px-4 max-md:hidden">Genre</th>
							<th className="py-4 px-4 text-center">Rating</th>
							<th className="py-4 px-4 text-center max-sm:hidden w-28">
								Year
							</th>
							<th className="py-4 px-4 text-center w-56">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100 text-sm">
						{books.map((book, index) => (
							<tr
								key={book._id}
								className="hover:bg-sky-50/40 transition-colors group"
							>
								<td className="py-4 px-4 text-center font-mono text-xs text-gray-400">
									{index + 1}
								</td>
								<td className="py-4 px-4">
									<div className="font-bold text-gray-900 line-clamp-1">
										{book.title}
									</div>
									<div className="text-xs text-gray-500 font-medium">
										by {book.author}
									</div>
								</td>
								<td className="py-4 px-4 max-md:hidden">
									<span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
										{book.genre || "Literature"}
									</span>
								</td>
								<td className="py-4 px-4 text-center">
									<div className="flex flex-col items-center justify-center">
										<RatingStars
											rating={book.rating || 4.5}
											ratingCount={book.ratingCount || 1}
											showScore={true}
											size="xs"
										/>
									</div>
								</td>
								<td className="py-4 px-4 text-center max-sm:hidden">
									<span className="inline-block px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold">
										{book.publishYear}
									</span>
								</td>
								<td className="py-4 px-4">
									<div className="flex justify-center items-center gap-1.5">
										{/* Read 2-Page Book Preview */}
										<button
											type="button"
											onClick={() => setActiveBookForReader(book)}
											className="inline-flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm transition-all"
											title="Open 2-Page Book Reader"
										>
											<PiBookBookmarkFill className="text-sm text-amber-300" />
											<span className="hidden lg:inline">Read 2-Page</span>
										</button>

										{/* Quick Rate Button */}
										<button
											type="button"
											onClick={() => setActiveBookForRating(book)}
											className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
											title="Rate Book"
										>
											<BsStarFill className="text-sm" />
										</button>

										<Link
											to={`/books/details/${book._id}`}
											className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
											title="Details & Reviews"
										>
											<BsInfoCircle className="text-lg" />
										</Link>
										<Link
											to={`/books/edit/${book._id}`}
											className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
											title="Edit"
										>
											<AiOutlineEdit className="text-lg" />
										</Link>
										<Link
											to={`/books/delete/${book._id}`}
											className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
											title="Delete"
										>
											<MdOutlineDelete className="text-lg" />
										</Link>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Reader Modal */}
			{activeBookForReader && (
				<TwoPageBookReader
					book={activeBookForReader}
					onClose={() => setActiveBookForReader(null)}
					onBookUpdated={onBookUpdated}
				/>
			)}

			{/* Rating Modal */}
			{activeBookForRating && (
				<RateBookModal
					book={activeBookForRating}
					onClose={() => setActiveBookForRating(null)}
					onRatingSubmitted={onBookUpdated}
				/>
			)}
		</>
	);
};

export default BooksTable;
