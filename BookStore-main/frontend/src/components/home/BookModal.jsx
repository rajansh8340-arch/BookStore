import { AiOutlineClose } from "react-icons/ai";
import { PiBookOpenTextLight, PiBookBookmarkFill } from "react-icons/pi";
import { BiUserCircle, BiCalendar } from "react-icons/bi";
import RatingStars from "../RatingStars";

const BookModal = ({ book, onClose, onOpenReader }) => {
	if (!book) return null;

	const formatId = (id) => {
		if (!id || typeof id !== "string") return "";
		return id.length >= 8 ? id.slice(-8).toUpperCase() : id.toUpperCase();
	};

	const displayId = formatId(book._id);

	return (
		<div
			className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200"
			onClick={onClose}
		>
			<div
				onClick={(event) => event.stopPropagation()}
				className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 flex flex-col relative shadow-2xl border border-gray-100"
			>
				<button
					type="button"
					aria-label="Close modal"
					className="absolute top-5 right-5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
					onClick={onClose}
				>
					<AiOutlineClose className="text-xl" />
				</button>

				{/* Badges Bar */}
				<div className="flex flex-wrap items-center justify-between gap-2 mb-4 pr-10">
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 text-xs font-semibold px-3 py-1 rounded-full">
							<BiCalendar className="text-sm" />
							{book.publishYear}
						</span>
						<span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
							{book.genre || "Classic Literature"}
						</span>
					</div>

					{displayId && (
						<span className="text-xs font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
							#{displayId}
						</span>
					)}
				</div>

				{/* Title and Author */}
				<div className="flex items-start gap-3 mb-2">
					<PiBookOpenTextLight className="text-sky-600 text-3xl flex-shrink-0 mt-0.5" />
					<div>
						<h2 className="text-2xl font-extrabold text-gray-900 leading-snug font-display">
							{book.title}
						</h2>
						<div className="flex items-center gap-2 text-gray-600 mt-1">
							<BiUserCircle className="text-sky-600 text-lg" />
							<span className="text-sm font-medium">by {book.author}</span>
						</div>
					</div>
				</div>

				{/* Rating Display */}
				<div className="my-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-100 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<RatingStars
							rating={book.rating || 4.5}
							ratingCount={book.ratingCount || 1}
							showCount={true}
							showScore={true}
							size="sm"
						/>
					</div>
					<span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded-lg">
						{book.rating >= 4.5 ? "Top Rated ★" : "Popular Choice"}
					</span>
				</div>

				{/* Synopsis */}
				<div className="border-t border-gray-100 pt-4 mb-5">
					<h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
						Synopsis
					</h3>
					<p className="text-gray-700 text-sm sm:text-base leading-relaxed max-h-48 overflow-y-auto pr-2">
						{book.description || "No description provided."}
					</p>
				</div>

				{/* CTA to open 2-Page Book Reader */}
				<div className="flex gap-3 pt-2 border-t border-gray-100">
					<button
						type="button"
						onClick={onClose}
						className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
					>
						Close
					</button>
					<button
						type="button"
						onClick={onOpenReader}
						className="w-2/3 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
					>
						<PiBookBookmarkFill className="text-amber-300 text-lg" />
						<span>Open 2-Page Book Preview</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default BookModal;
