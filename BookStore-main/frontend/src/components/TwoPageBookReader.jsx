import { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { PiSpeakerHighFill, PiSpeakerSlashFill, PiPauseFill, PiPlayFill } from "react-icons/pi";
import { BsStarFill } from "react-icons/bs";
import { MdAutoStories } from "react-icons/md";
import RatingStars from "./RatingStars";
import RateBookModal from "./RateBookModal";

const THEMES = {
	parchment: {
		id: "parchment",
		name: "Parchment",
		wrapper: "bg-amber-950/80",
		bookBg: "bg-[#fcf5e5]",
		text: "text-[#2b1810]",
		subText: "text-[#78543e]",
		border: "border-[#dcc8a4]",
		spine: "bg-[#ebd7b2]",
		pageBg: "bg-[#fcf5e5]",
		accent: "text-amber-800",
		buttonActive: "bg-amber-800 text-white",
	},
	sepia: {
		id: "sepia",
		name: "Sepia",
		wrapper: "bg-stone-900/80",
		bookBg: "bg-[#f4ecd8]",
		text: "text-[#3f3122]",
		subText: "text-[#7a644c]",
		border: "border-[#d8c8ab]",
		spine: "bg-[#e2d5b8]",
		pageBg: "bg-[#f4ecd8]",
		accent: "text-[#7a4820]",
		buttonActive: "bg-[#684729] text-white",
	},
	clean: {
		id: "clean",
		name: "White",
		wrapper: "bg-slate-900/80",
		bookBg: "bg-[#ffffff]",
		text: "text-slate-800",
		subText: "text-slate-500",
		border: "border-slate-200",
		spine: "bg-slate-100",
		pageBg: "bg-[#ffffff]",
		accent: "text-sky-700",
		buttonActive: "bg-sky-600 text-white",
	},
	midnight: {
		id: "midnight",
		name: "Night",
		wrapper: "bg-black/90",
		bookBg: "bg-[#18181b]",
		text: "text-zinc-200",
		subText: "text-zinc-400",
		border: "border-zinc-800",
		spine: "bg-[#27272a]",
		pageBg: "bg-[#18181b]",
		accent: "text-amber-400",
		buttonActive: "bg-zinc-700 text-white",
	},
};

const TwoPageBookReader = ({ book, onClose, onBookUpdated }) => {
	const [currentBook, setCurrentBook] = useState(book);
	const [theme, setTheme] = useState("parchment");
	const [fontSize, setFontSize] = useState("md");
	const [fontFamily, setFontFamily] = useState("serif");
	const [activeMobilePage, setActiveMobilePage] = useState(1);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showRateModal, setShowRateModal] = useState(false);

	// Text to speech state
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		setCurrentBook(book);
	}, [book]);

	const currentTheme = THEMES[theme] || THEMES.parchment;

	// Extract or generate 2 pages
	const page1Title =
		currentBook?.samplePages?.page1?.chapterTitle ||
		`Chapter I: The Chronicles of ${currentBook?.title || "Story"}`;
	const page2Title =
		currentBook?.samplePages?.page2?.chapterTitle || "Chapter I: Continuation";

	let page1Paragraphs =
		currentBook?.samplePages?.page1?.paragraphs &&
		currentBook.samplePages.page1.paragraphs.length > 0
			? currentBook.samplePages.page1.paragraphs
			: null;

	let page2Paragraphs =
		currentBook?.samplePages?.page2?.paragraphs &&
		currentBook.samplePages.page2.paragraphs.length > 0
			? currentBook.samplePages.page2.paragraphs
			: null;

	// Fallback generator if samplePages are empty
	if (!page1Paragraphs || !page2Paragraphs) {
		const rawDesc = currentBook?.description || "An unforgettable and classic literary masterpiece.";
		const sentences = rawDesc.split(/(?<=[.?!])\s+/).filter(Boolean);
		const mid = Math.max(1, Math.ceil(sentences.length / 2));
		
		const p1First = sentences.slice(0, mid).join(" ");
		const p2First = sentences.slice(mid).join(" ");

		page1Paragraphs = [
			p1First || rawDesc,
			`Written by ${currentBook?.author || "the author"}, this opening sequence sets the profound mood and atmosphere that surrounds the heart of this narrative.`,
		];

		page2Paragraphs = [
			p2First || "As the dawn light filtered through the quiet horizon, the unraveling truth began to take shape across every chapter.",
			"Every page holds a memory, a philosophy, and an enduring question that stays with the reader long after the book is closed.",
		];
	}

	const fullReadingText = `${currentBook?.title || ""}, by ${currentBook?.author || ""}. ${page1Title}. ${page1Paragraphs.join(" ")}. ${page2Title}. ${page2Paragraphs.join(" ")}`;

	// Stop speech on unmount
	useEffect(() => {
		return () => {
			if ("speechSynthesis" in window) {
				window.speechSynthesis.cancel();
			}
		};
	}, []);

	// Text to speech handlers
	const handleToggleSpeech = () => {
		if (!("speechSynthesis" in window)) {
			alert("Speech Synthesis is not supported in this browser.");
			return;
		}

		if (isSpeaking) {
			if (isPaused) {
				window.speechSynthesis.resume();
				setIsPaused(false);
			} else {
				window.speechSynthesis.pause();
				setIsPaused(true);
			}
		} else {
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(fullReadingText);
			utterance.rate = 0.95;
			utterance.pitch = 1.0;
			
			utterance.onend = () => {
				setIsSpeaking(false);
				setIsPaused(false);
			};

			utterance.onerror = () => {
				setIsSpeaking(false);
				setIsPaused(false);
			};

			window.speechSynthesis.speak(utterance);
			setIsSpeaking(true);
			setIsPaused(false);
		}
	};

	const handleStopSpeech = () => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();
		}
		setIsSpeaking(false);
		setIsPaused(false);
	};

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	const fontSizes = {
		sm: "text-xs sm:text-sm leading-relaxed",
		md: "text-sm sm:text-base leading-relaxed sm:leading-loose",
		lg: "text-base sm:text-lg leading-loose",
	};

	const fontFamilyClass =
		fontFamily === "serif"
			? "font-serif"
			: "font-sans";

	return (
		<div
			className={`fixed inset-0 z-50 flex flex-col justify-center items-center p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto ${currentTheme.wrapper} transition-colors duration-300`}
			onClick={onClose}
		>
			{/* Reader Container */}
			<div
				onClick={(e) => e.stopPropagation()}
				className={`w-full max-w-5xl flex flex-col ${
					isFullscreen ? "h-[96vh]" : "max-h-[92vh]"
				} rounded-3xl overflow-hidden shadow-2xl border ${currentTheme.border} transition-all duration-300 animate-in zoom-in-95 duration-200`}
			>
				{/* Top Controls Toolbar */}
				<div className="bg-slate-900/90 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 backdrop-blur-sm z-20">
					{/* Left: Book Info & 2-Page Spread Label */}
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
							<MdAutoStories />
						</div>
						<div>
							<h3 className="text-sm font-bold tracking-tight text-white line-clamp-1">
								{currentBook?.title}
							</h3>
							<div className="flex items-center gap-2 text-xs text-gray-300">
								<span>by {currentBook?.author}</span>
								<span>•</span>
								<span className="text-amber-400 font-semibold">2-Page Reader</span>
							</div>
						</div>
					</div>

					{/* Center: Controls (Themes, Fonts, Speech) */}
					<div className="flex items-center flex-wrap gap-2 text-xs">
						{/* Theme Switcher */}
						<div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
							{Object.values(THEMES).map((t) => (
								<button
									key={t.id}
									type="button"
									onClick={() => setTheme(t.id)}
									className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
										theme === t.id
											? "bg-white text-gray-900 font-bold shadow-sm"
											: "text-gray-400 hover:text-white"
									}`}
								>
									{t.name}
								</button>
							))}
						</div>

						{/* Font Size */}
						<div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
							<button
								type="button"
								onClick={() => setFontSize("sm")}
								className={`px-2 py-1 rounded-lg ${
									fontSize === "sm" ? "bg-white text-gray-900 font-bold" : "text-gray-400 hover:text-white"
								}`}
								title="Small Font"
							>
								A-
							</button>
							<button
								type="button"
								onClick={() => setFontSize("md")}
								className={`px-2 py-1 rounded-lg ${
									fontSize === "md" ? "bg-white text-gray-900 font-bold" : "text-gray-400 hover:text-white"
								}`}
								title="Default Font"
							>
								A
							</button>
							<button
								type="button"
								onClick={() => setFontSize("lg")}
								className={`px-2 py-1 rounded-lg ${
									fontSize === "lg" ? "bg-white text-gray-900 font-bold" : "text-gray-400 hover:text-white"
								}`}
								title="Large Font"
							>
								A+
							</button>
						</div>

						{/* Font Type Toggle */}
						<button
							type="button"
							onClick={() => setFontFamily(fontFamily === "serif" ? "sans" : "serif")}
							className="px-2.5 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl font-medium text-gray-300 hover:text-white transition-colors"
							title="Toggle Serif / Sans Font"
						>
							{fontFamily === "serif" ? "Serif" : "Sans"}
						</button>

						{/* Read Aloud Text-to-Speech */}
						<div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10">
							<button
								type="button"
								onClick={handleToggleSpeech}
								className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
									isSpeaking
										? "bg-amber-500 text-slate-900 font-bold animate-pulse"
										: "text-gray-300 hover:text-white"
								}`}
								title="Listen to Book Narration"
							>
								{isSpeaking ? (
									isPaused ? (
										<>
											<PiPlayFill className="text-sm" />
											<span>Resume</span>
										</>
									) : (
										<>
											<PiPauseFill className="text-sm" />
											<span>Pause</span>
										</>
									)
								) : (
									<>
										<PiSpeakerHighFill className="text-sm text-amber-400" />
										<span>Read Aloud</span>
									</>
								)}
							</button>

							{isSpeaking && (
								<button
									type="button"
									onClick={handleStopSpeech}
									className="px-2 py-1 text-red-400 hover:text-red-300"
									title="Stop Narration"
								>
									<PiSpeakerSlashFill />
								</button>
							)}
						</div>
					</div>

					{/* Right: Rate Book CTA & Close */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setShowRateModal(true)}
							className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold px-3 py-1.5 rounded-xl border border-amber-500/40 transition-all"
						>
							<BsStarFill className="text-xs" />
							<span>Rate Book ({currentBook?.rating ? Number(currentBook.rating).toFixed(1) : "4.8"}★)</span>
						</button>

						<button
							type="button"
							onClick={toggleFullscreen}
							className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
							title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
						>
							{isFullscreen ? <AiOutlineFullscreenExit className="text-lg" /> : <AiOutlineFullscreen className="text-lg" />}
						</button>

						<button
							type="button"
							onClick={onClose}
							className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors"
							title="Close Reader"
						>
							<AiOutlineClose className="text-xl" />
						</button>
					</div>
				</div>

				{/* Mobile Page Switcher */}
				<div className="md:hidden flex items-center justify-between px-4 py-2 bg-black/20 border-b border-black/10 text-xs">
					<button
						type="button"
						onClick={() => setActiveMobilePage(1)}
						className={`px-4 py-1.5 rounded-full font-bold transition-all ${
							activeMobilePage === 1
								? "bg-amber-600 text-white shadow-sm"
								: "text-gray-600 bg-white/40"
						}`}
					>
						Page 1 (Opening)
					</button>
					<span className="text-xs font-serif font-bold text-gray-500">
						Book Preview Spread
					</span>
					<button
						type="button"
						onClick={() => setActiveMobilePage(2)}
						className={`px-4 py-1.5 rounded-full font-bold transition-all ${
							activeMobilePage === 2
								? "bg-amber-600 text-white shadow-sm"
								: "text-gray-600 bg-white/40"
						}`}
					>
						Page 2 (Continuation)
					</button>
				</div>

				{/* 2-Page Spread */}
				<div
					className={`flex-grow relative ${currentTheme.bookBg} p-4 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-between`}
				>
					{/* Spine Divider */}
					<div className="hidden md:block book-spine-divider" />

					{/* Pages Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative flex-grow items-stretch">
						{/* LEFT PAGE (PAGE 1) */}
						<div
							className={`flex flex-col justify-between p-2 sm:p-4 rounded-xl page-shadow-left ${
								activeMobilePage === 1 ? "block" : "hidden md:flex"
							}`}
						>
							<div className="border-b border-black/10 pb-2 mb-4 text-center">
								<p
									className={`text-[11px] uppercase tracking-widest font-serif ${currentTheme.subText} font-semibold`}
								>
									{currentBook?.title}
								</p>
							</div>

							<div className="flex-grow space-y-4">
								<div className="text-center mb-6">
									<h4
										className={`text-base sm:text-lg font-serif font-bold ${currentTheme.accent} tracking-wide`}
									>
										{page1Title}
									</h4>
									<div className="w-16 h-0.5 bg-current mx-auto mt-2 opacity-30" />
								</div>

								{page1Paragraphs.map((paragraph, idx) => (
									<p
										key={idx}
										className={`${fontSizes[fontSize]} ${fontFamilyClass} ${
											currentTheme.text
										} text-justify ${
											idx === 0 ? "drop-cap font-medium" : "indent-6"
										}`}
									>
										{paragraph}
									</p>
								))}
							</div>

							<div className="border-t border-black/10 pt-3 mt-6 flex justify-between items-center text-xs">
								<span className={`font-serif italic ${currentTheme.subText}`}>
									{currentBook?.genre || "Literature"}
								</span>
								<span className={`font-serif font-bold ${currentTheme.subText}`}>
									— 1 —
								</span>
							</div>
						</div>

						{/* RIGHT PAGE (PAGE 2) */}
						<div
							className={`flex flex-col justify-between p-2 sm:p-4 rounded-xl page-shadow-right ${
								activeMobilePage === 2 ? "block" : "hidden md:flex"
							}`}
						>
							<div className="border-b border-black/10 pb-2 mb-4 text-center">
								<p
									className={`text-[11px] uppercase tracking-widest font-serif ${currentTheme.subText} font-semibold`}
								>
									By {currentBook?.author} ({currentBook?.publishYear})
								</p>
							</div>

							<div className="flex-grow space-y-4">
								<div className="text-center mb-6">
									<h4
										className={`text-base sm:text-lg font-serif font-bold ${currentTheme.accent} tracking-wide`}
									>
										{page2Title}
									</h4>
									<div className="w-16 h-0.5 bg-current mx-auto mt-2 opacity-30" />
								</div>

								{page2Paragraphs.map((paragraph, idx) => (
									<p
										key={idx}
										className={`${fontSizes[fontSize]} ${fontFamilyClass} ${currentTheme.text} text-justify indent-6`}
									>
										{paragraph}
									</p>
								))}

								<div className="my-4 p-4 rounded-xl bg-black/5 border-l-4 border-amber-500/80 text-xs sm:text-sm font-serif italic text-gray-600">
									"Books are a uniquely portable magic." — Continue reading the complete story in our collection.
								</div>
							</div>

							<div className="border-t border-black/10 pt-3 mt-6 flex justify-between items-center text-xs">
								<span className={`font-serif font-bold ${currentTheme.subText}`}>
									— 2 —
								</span>
								<div className="flex items-center gap-1.5">
									<RatingStars rating={currentBook?.rating || 4.8} size="xs" />
									<span className={`font-medium ${currentTheme.subText}`}>
										{currentBook?.rating ? Number(currentBook.rating).toFixed(1) : "4.8"}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Ribbon */}
					<div className="mt-4 pt-3 border-t border-black/10 flex flex-wrap justify-between items-center gap-3 text-xs">
						<div className="flex items-center gap-2">
							<span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
							<span className={`font-semibold ${currentTheme.subText}`}>
								Authentic 2-Page Sample Edition
							</span>
						</div>

						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setShowRateModal(true)}
								className="text-amber-700 hover:text-amber-900 font-bold hover:underline flex items-center gap-1"
							>
								⭐ Rate & Review this Book
							</button>
							<span className="text-gray-300">•</span>
							<button
								type="button"
								onClick={onClose}
								className={`font-semibold hover:underline ${currentTheme.subText}`}
							>
								Done Reading
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Sub-modal: Rate Book */}
			{showRateModal && (
				<RateBookModal
					book={currentBook}
					onClose={() => setShowRateModal(false)}
					onRatingSubmitted={(updated) => {
						setCurrentBook(updated);
						if (onBookUpdated) onBookUpdated(updated);
					}}
				/>
			)}
		</div>
	);
};

export default TwoPageBookReader;
