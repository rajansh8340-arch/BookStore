import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Spinner from "../components/Spinner";
import BooksTable from "../components/home/BooksTable";
import BooksCard from "../components/home/BooksCard";
import { useAuth } from "../context/AuthContext";
import { MdOutlineAddBox, MdAutoStories } from "react-icons/md";
import { BsTable, BsGrid, BsSearch, BsStarFill, BsFilter } from "react-icons/bs";
import { useSnackbar } from "notistack";

const GENRES = [
	"All",
	"Classic Fiction",
	"Dystopian Sci-Fi",
	"Fantasy",
	"Romance & Classic",
	"Adventure & Epic",
	"Gothic Romance",
	"Psychological Classic",
	"Epic Poetry",
];

const Home = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showType, setShowType] = useState("card");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("All");
	const [minRating, setMinRating] = useState(0);
	const [sortBy, setSortBy] = useState("default");

	const { user } = useAuth();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const fetchBooks = () => {
		setLoading(true);
		apiClient
			.get("/books")
			.then((response) => {
				const data = response.data?.data || response.data || [];
				setBooks(Array.isArray(data) ? data : []);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Fetch books error:", error);
				enqueueSnackbar(error.userMessage || "Failed to load books", {
					variant: "error",
				});
				setBooks([]);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	const handleBookUpdated = (updatedBook) => {
		if (!updatedBook || !updatedBook._id) return;
		setBooks((prev) =>
			prev.map((b) => (b._id === updatedBook._id ? { ...b, ...updatedBook } : b))
		);
	};

	const handleCreateBookClick = () => {
		if (user) {
			navigate("/books/create");
		} else {
			navigate("/login", {
				state: { message: "Please log in to add a book to the store." },
			});
		}
	};

	// Filter and sort books
	const filteredBooks = useMemo(() => {
		return books
			.filter((book) => {
				const query = searchQuery.toLowerCase().trim();
				const matchesSearch =
					!query ||
					book.title?.toLowerCase().includes(query) ||
					book.author?.toLowerCase().includes(query) ||
					book.genre?.toLowerCase().includes(query) ||
					String(book.publishYear || "").includes(query);

				const matchesGenre =
					selectedGenre === "All" ||
					(book.genre &&
						book.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

				const matchesRating =
					minRating === 0 || (book.rating && book.rating >= minRating);

				return matchesSearch && matchesGenre && matchesRating;
			})
			.sort((a, b) => {
				if (sortBy === "rating_high") {
					return (b.rating || 0) - (a.rating || 0);
				}
				if (sortBy === "year_desc") {
					return (b.publishYear || 0) - (a.publishYear || 0);
				}
				if (sortBy === "year_asc") {
					return (a.publishYear || 0) - (b.publishYear || 0);
				}
				if (sortBy === "title") {
					return (a.title || "").localeCompare(b.title || "");
				}
				return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
			});
	}, [books, searchQuery, selectedGenre, minRating, sortBy]);

	// Library statistics
	const totalBooks = books.length;
	const avgRating = totalBooks
		? (
				books.reduce((acc, b) => acc + (b.rating || 4.5), 0) / totalBooks
		  ).toFixed(1)
		: "4.8";
	const totalReviews = books.reduce(
		(acc, b) => acc + (b.ratingCount || 1),
		0
	);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
			{/* Hero Banner with Stats */}
			<div className="relative rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
				<div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="max-w-2xl">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
							<MdAutoStories className="text-sm" />
							<span>Interactive Literary Experience</span>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight text-white">
							Discover, Read & Rate <br className="hidden sm:inline" />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-200 to-white">
								Timeless Books
							</span>
						</h1>
						<p className="text-sm sm:text-base text-sky-100/80 mt-3 leading-relaxed">
							Immerse yourself in authentic 2-page sample book spreads with voice narration, explore reader ratings, and add your own masterpieces to the community.
						</p>
					</div>

					{/* Quick Stats Cards */}
					<div className="grid grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
						<div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 text-center">
							<div className="text-xl sm:text-2xl font-black text-white">
								{totalBooks}
							</div>
							<div className="text-[11px] font-medium text-sky-200 mt-0.5">
								Books
							</div>
						</div>
						<div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 text-center">
							<div className="text-xl sm:text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
								<span>{avgRating}</span>
								<BsStarFill className="text-sm" />
							</div>
							<div className="text-[11px] font-medium text-sky-200 mt-0.5">
								Avg Rating
							</div>
						</div>
						<div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 text-center">
							<div className="text-xl sm:text-2xl font-black text-emerald-300">
								{totalReviews}+
							</div>
							<div className="text-[11px] font-medium text-sky-200 mt-0.5">
								Ratings
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Filter & Controls Bar */}
			<div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-200/80 space-y-4">
				{/* Top Row: Search + View Mode + Add Book */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					{/* Search */}
					<div className="relative flex-1">
						<BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
						<input
							type="text"
							placeholder="Search by book title, author, genre, or year..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center"
							>
								✕
							</button>
						)}
					</div>

					{/* View Toggle and Actions */}
					<div className="flex items-center gap-3">
						{/* Rating Filter Selector */}
						<div className="relative">
							<select
								value={minRating}
								onChange={(e) => setMinRating(Number(e.target.value))}
								className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 py-2.5 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
								title="Filter by Minimum Rating"
							>
								<option value={0}>All Ratings</option>
								<option value={4.8}>⭐ 4.8+ Top Tier</option>
								<option value={4.5}>⭐ 4.5+ Highly Rated</option>
								<option value={4.0}>⭐ 4.0+ Great Reads</option>
							</select>
						</div>

						{/* Sort Selector */}
						<div className="relative">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 py-2.5 px-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
								title="Sort Books"
							>
								<option value="default">Sort: Newest Added</option>
								<option value="rating_high">Sort: Highest Rated ⭐</option>
								<option value="year_desc">Sort: Publication (New to Old)</option>
								<option value="year_asc">Sort: Publication (Old to New)</option>
								<option value="title">Sort: Title (A to Z)</option>
							</select>
						</div>

						{/* View Toggle */}
						<div className="inline-flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
							<button
								type="button"
								onClick={() => setShowType("card")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
									showType === "card"
										? "bg-white text-sky-700 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
								title="Card Grid"
							>
								<BsGrid className="text-sm" />
								<span className="hidden sm:inline">Cards</span>
							</button>
							<button
								type="button"
								onClick={() => setShowType("table")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
									showType === "table"
										? "bg-white text-sky-700 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
								title="Table List"
							>
								<BsTable className="text-sm" />
								<span className="hidden sm:inline">Table</span>
							</button>
						</div>

						{/* Add Book Button */}
						<button
							type="button"
							onClick={handleCreateBookClick}
							className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
						>
							<MdOutlineAddBox className="text-lg" />
							<span className="hidden sm:inline">Add Book</span>
						</button>
					</div>
				</div>

				{/* Bottom Row: Genre Filter Chips */}
				<div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
					<span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1 flex-shrink-0">
						<BsFilter /> Genre:
					</span>
					{GENRES.map((g) => (
						<button
							key={g}
							type="button"
							onClick={() => setSelectedGenre(g)}
							className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
								selectedGenre === g
									? "bg-sky-600 text-white shadow-sm"
									: "bg-gray-100 hover:bg-gray-200 text-gray-700"
							}`}
						>
							{g}
						</button>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div>
				{loading ? (
					<Spinner />
				) : filteredBooks.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
						<div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
							📚
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-1">
							{searchQuery || selectedGenre !== "All" || minRating > 0
								? "No matching books found"
								: "No books available yet"}
						</h3>
						<p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
							{searchQuery || selectedGenre !== "All" || minRating > 0
								? "Try changing your search query, genre filter, or minimum rating threshold."
								: "Get started by adding the first book to our community bookstore!"}
						</p>
						{searchQuery || selectedGenre !== "All" || minRating > 0 ? (
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setSelectedGenre("All");
									setMinRating(0);
								}}
								className="text-sm text-sky-600 font-bold hover:underline"
							>
								Reset All Filters
							</button>
						) : (
							<button
								type="button"
								onClick={handleCreateBookClick}
								className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-sm"
							>
								<MdOutlineAddBox className="text-lg" />
								<span>Add Book Now</span>
							</button>
						)}
					</div>
				) : showType === "table" ? (
					<BooksTable
						books={filteredBooks}
						onBookUpdated={handleBookUpdated}
					/>
				) : (
					<BooksCard
						books={filteredBooks}
						onBookUpdated={handleBookUpdated}
					/>
				)}
			</div>
		</div>
	);
};

export default Home;
