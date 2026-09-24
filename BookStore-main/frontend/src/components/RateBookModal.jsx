import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsStarFill } from "react-icons/bs";
import { useSnackbar } from "notistack";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import RatingStars from "./RatingStars";

const ratingLabels = {
	1: "Poor - Not recommended",
	2: "Fair - Has some flaws",
	3: "Good - Enjoyable read",
	4: "Very Good - Highly recommended!",
	5: "Masterpiece - Must read!",
};

const RateBookModal = ({ book, onClose, onRatingSubmitted }) => {
	const [selectedRating, setSelectedRating] = useState(5);
	const [review, setReview] = useState("");
	const [reviewerName, setReviewerName] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const { user } = useAuth();
	const { enqueueSnackbar } = useSnackbar();

	if (!book) return null;

	const handleSubmitRating = async (e) => {
		e.preventDefault();

		if (selectedRating < 1 || selectedRating > 5) {
			enqueueSnackbar("Please pick a star rating between 1 and 5.", {
				variant: "warning",
			});
			return;
		}

		setSubmitting(true);
		try {
			const payload = {
				rating: selectedRating,
				review: review.trim() || undefined,
				userName: user?.name || reviewerName.trim() || undefined,
			};

			const response = await apiClient.post(`/books/${book._id}/rate`, payload);

			enqueueSnackbar("Thank you for your rating!", { variant: "success" });
			if (onRatingSubmitted) {
				onRatingSubmitted(response.data.data || response.data);
			}
			onClose();
		} catch (error) {
			console.error("Submit rating error:", error);
			enqueueSnackbar(
				error.userMessage || "Failed to submit rating. Please try again.",
				{ variant: "error" }
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200"
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-gray-100"
			>
				{/* Close Button */}
				<button
					type="button"
					aria-label="Close"
					onClick={onClose}
					className="absolute top-5 right-5 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
				>
					<AiOutlineClose className="text-xl" />
				</button>

				{/* Header */}
				<div className="text-center mb-6">
					<div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
						<BsStarFill className="text-2xl" />
					</div>
					<h2 className="text-2xl font-extrabold text-gray-900 font-display">
						Rate this Book
					</h2>
					<p className="text-sm font-semibold text-sky-700 mt-1 line-clamp-1">
						{book.title}
					</p>
					<p className="text-xs text-gray-500">by {book.author}</p>
				</div>

				<form onSubmit={handleSubmitRating} className="space-y-5">
					{/* Interactive Star Picker */}
					<div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-100/80 text-center">
						<label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
							Choose your score
						</label>
						<div className="flex justify-center my-2">
							<RatingStars
								rating={selectedRating}
								interactive={true}
								onRate={(r) => setSelectedRating(r)}
								size="xl"
							/>
						</div>
						<p className="text-sm font-semibold text-amber-800 min-h-[20px] transition-all">
							{ratingLabels[selectedRating] || "Select rating"}
						</p>
					</div>

					{/* Reviewer Name (if not logged in) */}
					{!user && (
						<div>
							<label
								htmlFor="reviewerName"
								className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
							>
								Your Name (Optional)
							</label>
							<input
								id="reviewerName"
								type="text"
								value={reviewerName}
								onChange={(e) => setReviewerName(e.target.value)}
								placeholder="e.g. Jane Reader"
								className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
							/>
						</div>
					)}

					{/* Written Review */}
					<div>
						<label
							htmlFor="reviewText"
							className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
						>
							Write a Thought or Review (Optional)
						</label>
						<textarea
							id="reviewText"
							rows="3"
							value={review}
							onChange={(e) => setReview(e.target.value)}
							placeholder="What did you think of the story, writing style, or characters?"
							className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="w-2/3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
						>
							{submitting ? (
								<>
									<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
									<span>Submitting...</span>
								</>
							) : (
								<span>Submit Rating ⭐</span>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RateBookModal;
