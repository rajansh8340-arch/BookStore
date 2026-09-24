import { useState } from "react";
import { Link } from "react-router-dom";
import { PiBookOpenTextLight, PiBookBookmarkFill } from "react-icons/pi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle, BsStarFill } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import RatingStars from "../RatingStars";
import RateBookModal from "../RateBookModal";
import TwoPageBookReader from "../TwoPageBookReader";
import BookModal from "./BookModal";

const THEME_GRADIENTS = {
	amber: "from-amber-600 via-orange-600 to-amber-700",
	ocean: "from-sky-600 via-blue-600 to-indigo-700",
	emerald: "from-emerald-600 via-teal-600 to-green-700",
	rose: "from-rose-600 via-pink-600 to-red-700",
	purple: "from-purple-600 via-indigo-600 to-violet-800",
	slate: "from-slate-700 via-gray-800 to-zinc-900",
	gold: "from-yellow-600 via-amber-600 to-orange-700",
	navy: "from-blue-900 via-indigo-900 to-slate-900",
	crimson: "from-red-800 via-rose-900 to-stone-900",
	teal: "from-teal-600 via-cyan-700 to-sky-800",
	forest: "from-emerald-800 via-green-800 to-teal-900",
};

const BookSingleCard = ({ book, onBookUpdated }) => {
	const [showReader, setShowReader] = useState(false);
	const [showRateModal, setShowRateModal] = useState(false);
	const [showInfoModal, setShowInfoModal] = useState(false);

	if (!book) return null;

	const formatId = (id) => {
		if (!id || typeof id !== "string") return "";
		return id.length >= 8 ? id.slice(-8).toUpperCase() : id.toUpperCase();
	};

	const displayId = formatId(book._id);
	const coverGradient =
		THEME_GRADIENTS[book.coverTheme] || THEME_GRADIENTS.ocean;

	return (
		<>
			<div className="bg-white border border-gray-200/90 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1.5 shadow-sm">
				{/* Book Spine Accent Header */}
				<div
					className={`h-28 bg-gradient-to-r ${coverGradient} p-4 text-white relative overflow-hidden flex flex-col justify-between`}
				>
					<div className="absolute -right-4 -bottom-6 opacity-15 text-7xl font-serif select-none pointer-events-none">
						📖
					</div>

					{/* Top Tags */}
					<div className="flex justify-between items-center z-10">
						<span className="px-2.5 py-0.5 bg-black/30 backdrop-blur-md rounded-full text-[11px] font-semibold text-white/90 border border-white/20">
							{book.genre || "Literature"}
						</span>
						<span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold border border-white/30 shadow-sm">
							{book.publishYear}
						</span>
					</div>

					{/* Book Title */}
					<div className="z-10">
						<h3
							className="text-lg font-extrabold text-white line-clamp-1 drop-shadow-sm font-display tracking-tight"
							title={book.title}
						>
							{book.title}
						</h3>
						<p className="text-xs text-white/80 line-clamp-1 font-medium">
							by {book.author}
						</p>
					</div>
				</div>

				{/* Card Body */}
				<div className="p-5 flex-grow flex flex-col justify-between">
					{/* Star Rating Section */}
					<div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
						<div className="flex items-center gap-1.5">
							<RatingStars
								rating={book.rating || 4.5}
								ratingCount={book.ratingCount || 1}
								showCount={true}
								showScore={true}
								size="sm"
							/>
						</div>
						<button
							type="button"
							onClick={() => setShowRateModal(true)}
							className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
							title="Rate this book"
						>
							<BsStarFill className="text-[10px]" />
							<span>Rate</span>
						</button>
					</div>

					{/* Description preview */}
					<p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
						{book.description || "No description provided."}
					</p>

					{/* Primary 2-Page Reader CTA Button */}
					<div className="mb-4">
						<button
							type="button"
							onClick={() => setShowReader(true)}
							className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all group-hover:scale-[1.02]"
							title="Open realistic 2-page book spread"
						>
							<PiBookBookmarkFill className="text-base sm:text-lg text-amber-300 animate-bounce" />
							<span>Open 2-Page Book Preview</span>
						</button>
					</div>

					{/* Action Buttons Toolbar */}
					<div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-400 font-mono">
						<span>{displayId ? `#${displayId}` : ""}</span>

						<div className="flex items-center gap-1.5">
							<button
								type="button"
								onClick={() => setShowInfoModal(true)}
								className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
								title="Quick Synopsis"
								aria-label="Quick Synopsis"
							>
								<PiBookOpenTextLight className="text-lg" />
							</button>
							<Link
								to={`/books/details/${book._id}`}
								className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
								title="Full Details & Reviews"
								aria-label="Book Details"
							>
								<BsInfoCircle className="text-lg" />
							</Link>
							<Link
								to={`/books/edit/${book._id}`}
								className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
								title="Edit Book"
								aria-label="Edit Book"
							>
								<AiOutlineEdit className="text-lg" />
							</Link>
							<Link
								to={`/books/delete/${book._id}`}
								className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
								title="Delete Book"
								aria-label="Delete Book"
							>
								<MdOutlineDelete className="text-lg" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* 2-Page Book Reader Modal */}
			{showReader && (
				<TwoPageBookReader
					book={book}
					onClose={() => setShowReader(false)}
					onBookUpdated={onBookUpdated}
				/>
			)}

			{/* Rate Book Modal */}
			{showRateModal && (
				<RateBookModal
					book={book}
					onClose={() => setShowRateModal(false)}
					onRatingSubmitted={onBookUpdated}
				/>
			)}

			{/* Synopsis Modal */}
			{showInfoModal && (
				<BookModal
					book={book}
					onClose={() => setShowInfoModal(false)}
					onOpenReader={() => {
						setShowInfoModal(false);
						setShowReader(true);
					}}
				/>
			)}
		</>
	);
};

export default BookSingleCard;
