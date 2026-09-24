import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import { BiBook, BiUser, BiCalendar, BiDetail, BiCategory } from "react-icons/bi";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import RatingStars from "../components/RatingStars";

const GENRES = [
	"Classic Fiction",
	"Dystopian Sci-Fi",
	"Fantasy",
	"Romance & Classic",
	"Adventure & Epic",
	"Gothic Romance",
	"Psychological Classic",
	"Epic Poetry",
	"Mystery & Thriller",
	"Philosophy & Non-Fiction",
	"Biography & History",
];

const THEMES = [
	{ id: "ocean", name: "Ocean Blue", bg: "bg-sky-600" },
	{ id: "amber", name: "Warm Amber", bg: "bg-amber-600" },
	{ id: "emerald", name: "Emerald Teal", bg: "bg-emerald-600" },
	{ id: "rose", name: "Rose Crimson", bg: "bg-rose-600" },
	{ id: "purple", name: "Royal Purple", bg: "bg-purple-600" },
	{ id: "gold", name: "Classic Gold", bg: "bg-yellow-600" },
	{ id: "navy", name: "Midnight Navy", bg: "bg-blue-900" },
	{ id: "slate", name: "Graphite Slate", bg: "bg-slate-700" },
];

const CreateBooks = () => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [publishYear, setPublishYear] = useState("");
	const [description, setDescription] = useState("");
	const [genre, setGenre] = useState("Classic Fiction");
	const [rating, setRating] = useState(4.8);
	const [coverTheme, setCoverTheme] = useState("ocean");
	
	// Optional 2-page excerpt customization
	const [showCustomPages, setShowCustomPages] = useState(false);
	const [page1Chapter, setPage1Chapter] = useState("");
	const [page1Text, setPage1Text] = useState("");
	const [page2Chapter, setPage2Chapter] = useState("");
	const [page2Text, setPage2Text] = useState("");

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isAuthenticated) {
			enqueueSnackbar("Please log in to add a new book.", {
				variant: "warning",
			});
			navigate("/login", {
				state: { message: "You need to log in to post a book" },
			});
		}
	}, [isAuthenticated, navigate, enqueueSnackbar]);

	const handleSaveBook = (e) => {
		if (e) e.preventDefault();

		if (!title.trim() || !author.trim() || !publishYear || !description.trim()) {
			enqueueSnackbar("Please fill in all required fields.", {
				variant: "warning",
			});
			return;
		}

		const year = Number(publishYear);
		if (isNaN(year) || year < -3000 || year > new Date().getFullYear() + 10) {
			enqueueSnackbar("Please enter a valid publication year.", {
				variant: "warning",
			});
			return;
		}

		let customSamplePages = undefined;
		if (showCustomPages && (page1Text.trim() || page2Text.trim())) {
			customSamplePages = {
				page1: {
					chapterTitle: page1Chapter.trim() || `Chapter 1: The Beginning`,
					paragraphs: page1Text
						.split("\n\n")
						.map((p) => p.trim())
						.filter(Boolean),
				},
				page2: {
					chapterTitle: page2Chapter.trim() || "Chapter 1: Continuation",
					paragraphs: page2Text
						.split("\n\n")
						.map((p) => p.trim())
						.filter(Boolean),
				},
			};
		}

		const data = {
			title: title.trim(),
			author: author.trim(),
			publishYear: year,
			description: description.trim(),
			genre: genre.trim(),
			rating: Number(rating) || 4.5,
			coverTheme,
			samplePages: customSamplePages,
		};

		setLoading(true);

		apiClient
			.post("/books", data)
			.then(() => {
				setLoading(false);
				enqueueSnackbar("Book created with 2-page reader enabled!", {
					variant: "success",
				});
				navigate("/");
			})
			.catch((error) => {
				setLoading(false);
				console.error("Create book error:", error);
				enqueueSnackbar(
					error.userMessage || "Failed to create book. Please try again.",
					{ variant: "error" }
				);
			});
	};

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
			<BackButton destination="/" />

			<div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">
						Add a New Book
					</h1>
					<p className="text-sm text-gray-500 mt-2">
						Publish a book with custom ratings and 2-page sample preview
					</p>
				</div>

				{loading ? (
					<Spinner />
				) : (
					<form onSubmit={handleSaveBook} className="space-y-6">
						{/* Title */}
						<div>
							<label
								htmlFor="title"
								className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
							>
								Book Title *
							</label>
							<div className="relative">
								<BiBook className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
								<input
									id="title"
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. The Great Gatsby"
									required
									className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
								/>
							</div>
						</div>

						{/* Author & Year */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="author"
									className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
								>
									Author *
								</label>
								<div className="relative">
									<BiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
									<input
										id="author"
										type="text"
										value={author}
										onChange={(e) => setAuthor(e.target.value)}
										placeholder="e.g. F. Scott Fitzgerald"
										required
										className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="publishYear"
									className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
								>
									Publication Year *
								</label>
								<div className="relative">
									<BiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
									<input
										id="publishYear"
										type="number"
										value={publishYear}
										onChange={(e) => setPublishYear(e.target.value)}
										placeholder="e.g. 1925"
										required
										className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
									/>
								</div>
							</div>
						</div>

						{/* Genre & Rating */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="genre"
									className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
								>
									Genre Category
								</label>
								<div className="relative">
									<BiCategory className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
									<select
										id="genre"
										value={genre}
										onChange={(e) => setGenre(e.target.value)}
										className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
									>
										{GENRES.map((g) => (
											<option key={g} value={g}>
												{g}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
									Initial Rating (1-5 Stars)
								</label>
								<div className="flex items-center gap-3 p-2 bg-gray-50 rounded-2xl border border-gray-200">
									<RatingStars
										rating={rating}
										interactive={true}
										onRate={(r) => setRating(r)}
										size="md"
									/>
									<span className="text-xs font-bold text-gray-700">
										{rating} / 5.0 ⭐
									</span>
								</div>
							</div>
						</div>

						{/* Cover Theme */}
						<div>
							<label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
								Card Theme Color
							</label>
							<div className="flex flex-wrap gap-2">
								{THEMES.map((t) => (
									<button
										key={t.id}
										type="button"
										onClick={() => setCoverTheme(t.id)}
										className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 ${
											t.bg
										} ${
											coverTheme === t.id
												? "ring-2 ring-offset-2 ring-slate-800 scale-105"
												: "opacity-80 hover:opacity-100"
										}`}
									>
										<span>{t.name}</span>
										{coverTheme === t.id && <span>✓</span>}
									</button>
								))}
							</div>
						</div>

						{/* Description */}
						<div>
							<label
								htmlFor="description"
								className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
							>
								Description / Synopsis *
							</label>
							<div className="relative">
								<BiDetail className="absolute left-3.5 top-3 text-gray-400 text-lg" />
								<textarea
									id="description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Write an overview of the story..."
									rows="3"
									required
									className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-y"
								/>
							</div>
						</div>

						{/* Accordion: Custom 2-Page Excerpt */}
						<div className="border border-sky-100 bg-sky-50/50 rounded-2xl p-4">
							<button
								type="button"
								onClick={() => setShowCustomPages(!showCustomPages)}
								className="w-full flex items-center justify-between text-xs font-bold text-sky-900 uppercase tracking-wider text-left"
							>
								<div className="flex items-center gap-2">
									<span>📖 Optional: Custom 2-Page Reader Excerpt</span>
									<span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full lowercase font-medium">
										auto-generated if empty
									</span>
								</div>
								{showCustomPages ? <BsChevronUp /> : <BsChevronDown />}
							</button>

							{showCustomPages && (
								<div className="mt-4 space-y-4 pt-4 border-t border-sky-200/60">
									<p className="text-xs text-sky-700">
										Provide paragraphs for the dual-page book reading spread. Separate distinct paragraphs with double enter (empty line).
									</p>

									<div className="space-y-2">
										<label className="block text-xs font-bold text-gray-700">
											Page 1 Chapter Title & Paragraphs
										</label>
										<input
											type="text"
											value={page1Chapter}
											onChange={(e) => setPage1Chapter(e.target.value)}
											placeholder="e.g. Chapter 1: The First Step"
											className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white"
										/>
										<textarea
											value={page1Text}
											onChange={(e) => setPage1Text(e.target.value)}
											placeholder="Paragraphs for left page..."
											rows="3"
											className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white"
										/>
									</div>

									<div className="space-y-2">
										<label className="block text-xs font-bold text-gray-700">
											Page 2 Chapter Title & Paragraphs
										</label>
										<input
											type="text"
											value={page2Chapter}
											onChange={(e) => setPage2Chapter(e.target.value)}
											placeholder="e.g. Chapter 1: Continuation"
											className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white"
										/>
										<textarea
											value={page2Text}
											onChange={(e) => setPage2Text(e.target.value)}
											placeholder="Paragraphs for right page..."
											rows="3"
											className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white"
										/>
									</div>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="pt-4 flex gap-4">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-2xl transition-all text-sm"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="w-2/3 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
							>
								<span>Save & Publish Book</span>
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default CreateBooks;
