import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import apiClient from "../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { MdOutlineDeleteOutline } from "react-icons/md";

const DeleteBook = () => {
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);

	const navigate = useNavigate();
	const { id } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		apiClient
			.get(`/books/${id}`)
			.then((response) => {
				if (isMounted) {
					setBook(response.data);
					setLoading(false);
				}
			})
			.catch((error) => {
				if (isMounted) {
					console.error("Fetch book details error:", error);
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [id]);

	const handleDeleteBook = () => {
		setDeleting(true);

		apiClient
			.delete(`/books/${id}`)
			.then(() => {
				setDeleting(false);
				enqueueSnackbar("Book deleted successfully", { variant: "success" });
				navigate("/");
			})
			.catch((error) => {
				setDeleting(false);
				console.error("Delete book error:", error);
				enqueueSnackbar(
					error.userMessage || "Failed to delete book. Please try again.",
					{ variant: "error" }
				);
			});
	};

	return (
		<div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
			<BackButton destination="/" />

			<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 text-center">
				<div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
					<MdOutlineDeleteOutline />
				</div>

				<h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
					Delete Book
				</h1>

				<p className="text-gray-500 text-sm mb-6">
					Are you sure you want to permanently delete this book? This action cannot be undone.
				</p>

				{loading ? (
					<Spinner />
				) : (
					<>
						{book && (
							<div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-200/70">
								<h3 className="font-bold text-gray-900 text-base mb-1">
									{book.title}
								</h3>
								<p className="text-sm text-gray-600">
									By <span className="font-medium">{book.author}</span> • {book.publishYear}
								</p>
							</div>
						)}

						<div className="flex gap-4">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all"
							>
								Cancel
							</button>
							<button
								type="button"
								disabled={deleting}
								onClick={handleDeleteBook}
								className="w-1/2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
							>
								{deleting ? (
									<>
										<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
										<span>Deleting...</span>
									</>
								) : (
									<span>Yes, Delete</span>
								)}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default DeleteBook;

