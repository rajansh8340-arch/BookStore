import { useState } from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const RatingStars = ({
	rating = 0,
	ratingCount,
	interactive = false,
	onRate,
	size = "md",
	showCount = false,
	showScore = false,
	className = "",
}) => {
	const [hoverRating, setHoverRating] = useState(0);

	const sizeClasses = {
		xs: "text-xs gap-0.5",
		sm: "text-sm gap-0.5",
		md: "text-base gap-1",
		lg: "text-xl gap-1.5",
		xl: "text-2xl gap-2",
	};

	const currentRating =
		interactive && hoverRating > 0 ? hoverRating : Number(rating) || 0;

	const renderStar = (index) => {
		const starValue = index + 1;
		const isInteractive = interactive;

		let starIcon;
		if (currentRating >= starValue) {
			starIcon = <BsStarFill className="text-amber-400 drop-shadow-sm" />;
		} else if (currentRating >= starValue - 0.5) {
			starIcon = <BsStarHalf className="text-amber-400 drop-shadow-sm" />;
		} else {
			starIcon = <BsStar className="text-gray-300" />;
		}

		if (isInteractive) {
			return (
				<button
					key={index}
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (onRate) onRate(starValue);
					}}
					onMouseEnter={() => setHoverRating(starValue)}
					onMouseLeave={() => setHoverRating(0)}
					className="focus:outline-none transform hover:scale-125 transition-transform duration-150 p-0.5 cursor-pointer"
					title={`Rate ${starValue} of 5 stars`}
				>
					{starIcon}
				</button>
			);
		}

		return (
			<span key={index} className="inline-block">
				{starIcon}
			</span>
		);
	};

	return (
		<div
			className={`inline-flex items-center ${
				sizeClasses[size] || sizeClasses.md
			} ${className}`}
		>
			<div className="flex items-center">
				{[0, 1, 2, 3, 4].map(renderStar)}
			</div>

			{showScore && (
				<span className="font-bold text-gray-800 ml-1 text-xs sm:text-sm">
					{Number(rating || 0).toFixed(1)}
				</span>
			)}

			{showCount && ratingCount !== undefined && (
				<span className="text-xs text-gray-500 ml-1 font-medium">
					({ratingCount})
				</span>
			)}
		</div>
	);
};

export default RatingStars;
