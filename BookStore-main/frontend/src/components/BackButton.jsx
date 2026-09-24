import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const BackButton = ({ destination }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (destination) {
			navigate(destination);
		} else {
			navigate(-1);
		}
	};

	return (
		<div className="flex mb-4">
			<button
				type="button"
				onClick={handleClick}
				className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm transition-all hover:shadow"
				title="Go Back"
			>
				<BsArrowLeft className="text-xl" />
				<span className="text-sm font-medium">Back</span>
			</button>
		</div>
	);
};

export default BackButton;

