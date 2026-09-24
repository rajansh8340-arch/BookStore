import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useSnackbar } from "notistack";
import { PiBookOpenTextLight, PiBookBookmarkFill } from "react-icons/pi";
import { BiUserCircle, BiCalendar } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { BsStarFill, BsChatLeftQuote } from "react-icons/bs";
import RatingStars from "../components/RatingStars";
import RateBookModal from "../components/RateBookModal";
import TwoPageBookReader from "../components/TwoPageBookReader";

const THEME_GRADIENTS = {
	amber: "from-amber-700 via-orange-800 to-amber-950",
	ocean: "from-sky-800 via-blue-900 to-indigo-950",
	emerald: "from-emerald-800 via-teal-900 to-slate-950",
	rose: "from-rose-800 via-pink-900 to-stone-950",
	purple: "from-purple-800 via-indigo-900 to-slate-950",
	slate: "from-slate-800 via-gray-900 to-black",
	gold: "from-amber-700 via-yellow-800 to-orange-950",
	navy: "from-blue-950 via-indigo-950 to-slate-950",
	crimson: "from-red-900 via-rose-950 to-neutral-950",
	teal: "from-teal-800 via-cyan-900 to-slate-950",
	forest: "from-emerald-900 via-green-950 to-teal-950",
};

const ShowBook = () => {
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showReader, setShowReader] = useState(false);
	const [showRateModal, setShowRateModal] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const fetchBook = () => {
		setLoading(true);
		apiClient
			.get(`/books/${id}`)
			.then((response) => {
				if (!response.data) {
					enqueueSnackbar("Book not found", { variant: "error" });
					navigate("/");
					return;
				}
				setBook(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Fetch book details error:", error);
				enqueueSnackbar(
					error.userMessage || "Failed to load book details.",
					{ variant: "error" }
				);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchBook();
	}, [id]);

	const formatId = (objectId) => {
		if (!objectId || typeof objectId !== "string") return "";
		return objectId.length >= 8
			? objectId.slice(-8).toUpperCase()
			: objectId.toUpperCase();
	};

	const coverGradient =
		THEME_GRADIENTS[book?.coverTheme] || THEME_GRADIENTS.ocean;

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
			<BackButton destination="/" />

			{loading ? (
				<Spinner />
			) : !book ? (
				<div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
					<p className="text-gray-500 mb-4">Book not found.</p>
					<Link
						to="/"
						className="inline-block bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-2xl"
					>
						Back to Home
					</Link>
				</div>
			) : (
				<div className="space-y-8">
					{/* Header Banner */}
					<div
						className={`rounded-3xl shadow-2xl bg-gradient-to-r ${coverGradient} text-white p-6 sm:p-10 relative overflow-hidden`}
					>
						<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
							<div className="max-w-2xl space-y-3">
								<div className="flex flex-wrap items-center gap-2 text-xs">
									<span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-sky-100 font-semibold px-3 py-1 rounded-full border border-white/20">
										<BiCalendar className="text-sm" />
										Published {book.publishYear}
									</span>
									<span className="bg-black/30 backdrop-blur-md text-amber-300 font-semibold px-3 py-1 rounded-full border border-white/10">
										{book.genre || "Classic Literature"}
									</span>
									<span className="text-xs font-mono text-white/60 bg-black/20 px-2.5 py-1 rounded-md">
										REF #{formatId(book._id)}
									</span>
								</div>

								<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
									{book.title}
								</h1>

								<div className="flex items-center gap-2 text-sky-200 text-lg">
									<BiUserCircle className="text-2xl" />
									<span>
										Written by{" "}
										<span className="font-bold text-white">{book.author}</span>
									</span>
								</div>

								{/* Star Rating in Hero */}
								<div className="flex items-center gap-3 pt-2">
									<div className="bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
										<RatingStars rating={book.rating || 4.5} size="sm" />
										<span className="text-sm font-black text-amber-300">
											{book.rating || 4.5} / 5.0
										</span>
										<span className="text-xs text-white/70">
											({book.ratingCount || 1}{" "}
											{book.ratingCount === 1 ? "review" : "reviews"})
										</span>
									</div>
								</div>
							</div>

							{/* Call to Action: Open 2-Page Reader */}
							<div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
								<button
									type="button"
									onClick={() => setShowReader(true)}
									className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
								>
									<PiBookBookmarkFill className="text-xl" />
									<span>Read 2-Page Book Preview</span>
								</button>

								<button
									type="button"
									onClick={() => setShowRateModal(true)}
									className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold px-6 py-3 rounded-2xl text-sm border border-white/20 transition-all"
								>
									<BsStarFill className="text-amber-400 text-sm" />
									<span>Rate & Review Book</span>
								</button>
							</div>
						</div>
					</div>

					{/* Main Book Content & Synopsis */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left 2 Cols: Synopsis and 2-Page Sample Overview */}
						<div className="lg:col-span-2 space-y-6">
							{/* Synopsis Card */}
							<div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
								<h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
									<PiBookOpenTextLight className="text-sky-600 text-2xl" />
									<span>Synopsis & Story Overview</span>
								</h2>
								<div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
									{book.description}
								</div>
							</div>

							{/* 2-Page Preview Banner */}
							<div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
								<div className="space-y-1 text-center sm:text-left">
									<span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
										Interactive Reader Ready
									</span>
									<h3 className="text-xl font-extrabold text-amber-950 font-display mt-2">
										Read the First 2 Pages Online
									</h3>
									<p className="text-xs sm:text-sm text-amber-800/80">
										Experience the opening chapters formatted like a real physical hardcover book with voice narration.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setShowReader(true)}
									className="flex-shrink-0 bg-sky-700 hover:bg-sky-800 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
								>
									<PiBookBookmarkFill className="text-amber-300 text-lg" />
									<span>Open Reader</span>
								</button>
							</div>

							{/* Community Reviews Section */}
							<div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
										<BsChatLeftQuote className="text-sky-600 text-xl" />
										<span>Reader Reviews ({book.ratings?.length || 0})</span>
									</h2>
									<button
										type="button"
										onClick={() => setShowRateModal(true)}
										className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl transition-colors"
									>
										+ Write Review
									</button>
								</div>

								{book.ratings && book.ratings.length > 0 ? (
									<div className="divide-y divide-gray-100 space-y-3 pt-2">
										{book.ratings.map((rev, idx) => (
											<div key={idx} className="pt-3 first:pt-0">
												<div className="flex items-center justify-between mb-1.5">
													<span className="font-bold text-gray-900 text-sm">
														{rev.userName || "Verified Reader"}
													</span>
													<RatingStars rating={rev.rating} size="xs" />
												</div>
												{rev.review && (
													<p className="text-sm text-gray-600 leading-relaxed font-serif italic">
														"{rev.review}"
													</p>
												)}
												<span className="text-[11px] text-gray-400 mt-1 block">
													{rev.createdAt
														? new Date(rev.createdAt).toLocaleDateString()
														: "Recently"}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-400 italic py-4 text-center">
										No reviews written yet. Be the first to share your thoughts!
									</p>
								)}
							</div>
						</div>

						{/* Right 1 Col: Rating Summary Card & Management */}
						<div className="space-y-6">
							{/* Rating Breakdown Card */}
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
								<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
									Customer Rating Score
								</h3>
								<div className="text-5xl font-black text-gray-900 font-display">
									{book.rating || 4.5}
								</div>
								<div className="flex justify-center">
									<RatingStars rating={book.rating || 4.5} size="lg" />
								</div>
								<p className="text-xs text-gray-500 font-medium">
									Based on {book.ratingCount || 1} reader evaluation
									{(book.ratingCount || 1) > 1 ? "s" : ""}
								</p>

								<button
									type="button"
									onClick={() => setShowRateModal(true)}
									className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-2xl text-xs sm:text-sm border border-amber-200 transition-colors"
								>
									Rate this Book ⭐
								</button>
							</div>

							{/* Metadata Card */}
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3 text-xs text-gray-600">
								<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
									Book Details
								</h3>
								<div className="flex justify-between py-1.5 border-b border-gray-50">
									<span className="text-gray-400">Published</span>
									<span className="font-semibold text-gray-800">
										{book.publishYear}
									</span>
								</div>
								<div className="flex justify-between py-1.5 border-b border-gray-50">
									<span className="text-gray-400">Genre</span>
									<span className="font-semibold text-gray-800">
										{book.genre || "Fiction"}
									</span>
								</div>
								<div className="flex justify-between py-1.5 border-b border-gray-50">
									<span className="text-gray-400">Sample Length</span>
									<span className="font-semibold text-emerald-600">
										2 Pages Included
									</span>
								</div>
								{book.createdAt && (
									<div className="flex justify-between py-1.5">
										<span className="text-gray-400">Added to Library</span>
										<span className="font-semibold text-gray-800">
											{new Date(book.createdAt).toLocaleDateString()}
										</span>
									</div>
								)}
							</div>

							{/* Actions Card */}
							<div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
								<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
									Management
								</h3>
								<div className="flex gap-2">
									<Link
										to={`/books/edit/${book._id}`}
										className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-2xl text-xs font-bold shadow-sm transition-all"
									>
										<AiOutlineEdit className="text-base" />
										<span>Edit</span>
									</Link>
									<Link
										to={`/books/delete/${book._id}`}
										className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-2xl text-xs font-bold shadow-sm transition-all"
									>
										<MdOutlineDelete className="text-base" />
										<span>Delete</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 2-Page Reader Modal */}
			{showReader && book && (
				<TwoPageBookReader
					book={book}
					onClose={() => setShowReader(false)}
					onBookUpdated={(updated) => setBook(updated)}
				/>
			)}

			{/* Rate Book Modal */}
			{showRateModal && book && (
				<RateBookModal
					book={book}
					onClose={() => setShowRateModal(false)}
					onRatingSubmitted={(updated) => setBook(updated)}
				/>
			)}
		</div>
	);
};

export default ShowBook;
