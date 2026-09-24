import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { useSnackbar } from "notistack";
import { MdOutlineAddBox } from "react-icons/md";
import { BsTable, BsGrid, BsBookmarks } from "react-icons/bs";
import BooksCard from "../components/home/BooksCard";
import BooksTable from "../components/home/BooksTable";
import Spinner from "../components/Spinner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MyBooks = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showType, setShowType] = useState("card");
	const { enqueueSnackbar } = useSnackbar();
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const fetchUserBooks = () => {
		if (!isAuthenticated) {
			setLoading(false);
			return;
		}

		setLoading(true);
		apiClient
			.get("/books/mybooks")
			.then((response) => {
				const data = Array.isArray(response.data)
					? response.data
					: response.data?.data || [];
				setBooks(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Fetch user books error:", error);
				if (error.response?.status === 404) {
					setBooks([]);
				} else {
					enqueueSnackbar(
						error.userMessage || "Error fetching your books.",
						{ variant: "error" }
					);
				}
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchUserBooks();
	}, [isAuthenticated]);

	const handleBookUpdated = (updatedBook) => {
		if (!updatedBook || !updatedBook._id) return;
		setBooks((prev) =>
			prev.map((b) => (b._id === updatedBook._id ? { ...b, ...updatedBook } : b))
		);
	};

	if (!isAuthenticated) {
		return (
			<div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
				<div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
					<BsBookmarks />
				</div>
				<h2 className="text-2xl font-extrabold text-gray-900 mb-2 font-display">
					Sign In Required
				</h2>
				<p className="text-sm text-gray-500 mb-6">
					Please log in to view and manage books added by you.
				</p>
				<Link
					to="/login"
					className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md transition-all"
				>
					Sign In
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
				<div>
					<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">
						My Added Books
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						{user?.name ? `${user.name}'s Collection` : "Your personal collection"} ({books.length} {books.length === 1 ? "book" : "books"})
					</p>
				</div>

				<div className="flex items-center gap-3">
					{books.length > 0 && (
						<div className="inline-flex bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
							<button
								type="button"
								onClick={() => setShowType("card")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
									showType === "card"
										? "bg-white text-sky-700 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
								title="Grid View"
							>
								<BsGrid className="text-sm" />
								<span>Cards</span>
							</button>
							<button
								type="button"
								onClick={() => setShowType("table")}
								className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
									showType === "table"
										? "bg-white text-sky-700 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
								title="Table View"
							>
								<BsTable className="text-sm" />
								<span>Table</span>
							</button>
						</div>
					)}

					<button
						type="button"
						onClick={() => navigate("/books/create")}
						className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
					>
						<MdOutlineAddBox className="text-xl" />
						<span>Add Book</span>
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div>
				{loading ? (
					<Spinner />
				) : books.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
						<div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
							📖
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-1">
							No books in your collection yet
						</h3>
						<p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
							You haven't posted any books yet. Add your first book to share it with everyone and enable 2-page reading!
						</p>
						<button
							type="button"
							onClick={() => navigate("/books/create")}
							className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm transition-all"
						>
							<MdOutlineAddBox className="text-lg" />
							<span>Add Your First Book</span>
						</button>
					</div>
				) : showType === "table" ? (
					<BooksTable
						books={books}
						onBookUpdated={handleBookUpdated}
					/>
				) : (
					<BooksCard
						books={books}
						onBookUpdated={handleBookUpdated}
					/>
				)}
			</div>
		</div>
	);
};

export default MyBooks;
