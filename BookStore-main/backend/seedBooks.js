const books = [
	{
		title: "To Kill a Mockingbird",
		author: "Harper Lee",
		publishYear: 1960,
		genre: "Classic Fiction",
		rating: 4.9,
		ratingCount: 248,
		coverTheme: "amber",
		description:
			"A novel about the serious issues of race and morality in the American South, warmly presented through the eyes of young Scout Finch as her father Atticus defends an innocent man.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: Maycomb Memories",
				paragraphs: [
					"When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem’s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury. His left arm was somewhat shorter than his right; when he stood or walked, the back of his hand was at right angles to his body.",
					"When enough years had gone by to enable us to look back on them, we sometimes discussed the events that led to his accident. I maintain that the Ewells started it all, but Jem said they started long before that. He said it began the summer Dill came to us, when Dill first gave us the idea of making Boo Radley come out.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: The Old Town",
				paragraphs: [
					"Maycomb was an old town, but it was a tired old town when I first knew it. In rainy weather the streets turned to red slop; grass grew on the sidewalks, the courthouse sagged in the square. Somehow, it was hotter then: a black dog suffered on a summer’s day; bony mules hitched to Hoover carts flicked flies in the sweltering shade of the live oaks.",
					"People moved slowly then. They ambled across the square, shuffled in and out of the stores around it, took their time about everything. A day was twenty-four hours long but seemed longer. There was no hurry, for there was nowhere to go, nothing to buy and no money to buy it with, nothing to see outside the boundaries of Maycomb County.",
				],
			},
		},
		ratings: [
			{
				userName: "Eleanor Vance",
				rating: 5,
				review: "An absolute masterpiece. Scout's innocent voice against serious moral dilemmas is timeless.",
			},
			{
				userName: "David K.",
				rating: 5,
				review: "Atticus Finch is one of the greatest moral figures in all of literature.",
			},
		],
	},
	{
		title: "1984",
		author: "George Orwell",
		publishYear: 1949,
		genre: "Dystopian Sci-Fi",
		rating: 4.8,
		ratingCount: 312,
		coverTheme: "slate",
		description:
			"A chilling dystopian vision of a totalitarian regime ruled by Big Brother, where surveillance is ubiquitous, history is rewritten, and independent thought is a crime.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: The Clocks Were Striking Thirteen",
				paragraphs: [
					"It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.",
					"The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: Big Brother Is Watching",
				paragraphs: [
					"Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week. The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way.",
					"On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran.",
				],
			},
		},
		ratings: [
			{
				userName: "Marcus Reed",
				rating: 5,
				review: "More relevant today than ever. A profound warning about authoritarianism.",
			},
			{
				userName: "Sarah Jenkins",
				rating: 4,
				review: "Bleak, gripping, and intensely thought-provoking.",
			},
		],
	},
	{
		title: "Pride and Prejudice",
		author: "Jane Austen",
		publishYear: 1813,
		genre: "Romance & Classic",
		rating: 4.9,
		ratingCount: 420,
		coverTheme: "rose",
		description:
			"A witty and romantic comedy of manners detailing the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: Truth Universally Acknowledged",
				paragraphs: [
					"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
					"However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: Netherfield Park",
				paragraphs: [
					"\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\" Mr. Bennet replied that he had not.",
					"\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\" Mr. Bennet made no answer. \"Do you not want to know who has taken it?\" cried his wife impatiently. \"You want to tell me, and I have no objection to hearing it.\" This was invitation enough.",
				],
			},
		},
		ratings: [
			{
				userName: "Clara Oswald",
				rating: 5,
				review: "Elizabeth Bennet is one of the sharpest, most lovable heroines ever written.",
			},
		],
	},
	{
		title: "The Great Gatsby",
		author: "F. Scott Fitzgerald",
		publishYear: 1925,
		genre: "Classic Fiction",
		rating: 4.7,
		ratingCount: 195,
		coverTheme: "emerald",
		description:
			"A critique of the Jazz Age and the elusive American Dream, told through the glittering parties and tragic obsession of the mysterious millionaire Jay Gatsby.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: In My Younger and More Vulnerable Years",
				paragraphs: [
					"In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.",
					"\"Whenever you feel like criticizing any one,\" he told me, \"just remember that all the people in this world haven’t had the advantages that you’ve had.\" He didn’t say any more, but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: The Green Light",
				paragraphs: [
					"In consequence, I’m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores. Reserving judgements is a matter of infinite hope.",
					"When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart. Only Gatsby, the man who gives his name to this book, was exempt from my reaction.",
				],
			},
		},
		ratings: [
			{
				userName: "Julian B.",
				rating: 5,
				review: "The prose in this book reads like golden poetry. Unforgettable ending.",
			},
		],
	},
	{
		title: "Moby Dick",
		author: "Herman Melville",
		publishYear: 1851,
		genre: "Adventure & Epic",
		rating: 4.4,
		ratingCount: 130,
		coverTheme: "navy",
		description:
			"An epic tale of obsession, revenge, and the sea, chronicling Captain Ahab's relentless pursuit of the mythical white sperm whale Moby Dick.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: Loomings",
				paragraphs: [
					"Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
					"It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, then, I account it high time to get to sea as soon as I can.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: Towards the Water",
				paragraphs: [
					"There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land.",
					"Look at the crowds of water-gazers there. Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears Hook to Coenties Slip, and from thence, by Whitehall northward. What do you see?—Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries.",
				],
			},
		},
	},
	{
		title: "The Hobbit",
		author: "J.R.R. Tolkien",
		publishYear: 1937,
		genre: "Fantasy",
		rating: 4.9,
		ratingCount: 510,
		coverTheme: "forest",
		description:
			"A fantasy adventure following the quiet hobbit Bilbo Baggins, whisked away on an unexpected journey by Gandalf the wizard to reclaim the Lonely Mountain from the dragon Smaug.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: An Unexpected Party",
				paragraphs: [
					"In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
					"It had a perfectly round door like a porthole, painted green, with a shiny yellow brass knob in the exact middle. The door opened on to a tube-shaped hall like a tunnel: a very comfortable tunnel without smoke, with panelled walls, and floors tiled and carpeted, provided with polished chairs, and lots and lots of pegs for hats and coats.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: Good Morning!",
				paragraphs: [
					"This hobbit was a very well-to-do hobbit, and his name was Baggins. The Bagginses had lived in the neighbourhood of The Hill for time out of mind, and people considered them very respectable, not only because most of them were rich, but also because they never had any adventures or did anything unexpected.",
					"By some curious chance one morning long ago in the quiet of the world, when there was less noise and more green, and the hobbits were still numerous and prosperous, Bilbo Baggins was standing at his door after breakfast smoking an enormous long wooden pipe that reached nearly down to his woolly toes—when along came Gandalf.",
				],
			},
		},
		ratings: [
			{
				userName: "Samwise G.",
				rating: 5,
				review: "The greatest adventure ever told! Bilbo is an inspiration.",
			},
		],
	},
	{
		title: "The Lord of the Rings",
		author: "J.R.R. Tolkien",
		publishYear: 1954,
		genre: "Fantasy & Epic",
		rating: 5.0,
		ratingCount: 680,
		coverTheme: "gold",
		description:
			"An epic fantasy journey following Frodo Baggins and the Fellowship in their dangerous quest to cast the One Ring into the fires of Mount Doom.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: A Long-Expected Party",
				paragraphs: [
					"When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
					"Bilbo was very rich and very peculiar, and had been the wonder of the Shire for sixty years, ever since his remarkable disappearance and unexpected return. The riches he had brought back from his travels had now become a local legend.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: Shadows of the Ring",
				paragraphs: [
					"At ninety-nine they began to call him well-preserved; but unchanged would have been nearer the mark. There were some that shook their heads and thought this was too much of a good thing; it seemed unfair that anyone should possess (apparently) perpetual youth as well as (reputedly) inexhaustible wealth.",
					"\"It will have to be paid for,\" they said. \"It isn't natural, and trouble will come of it!\" But so far trouble had not come; and as Mr. Baggins was generous with his money, most people were willing to forgive him his eccentricities and his good fortune.",
				],
			},
		},
	},
	{
		title: "Jane Eyre",
		author: "Charlotte Brontë",
		publishYear: 1847,
		genre: "Gothic Romance",
		rating: 4.7,
		ratingCount: 180,
		coverTheme: "purple",
		description:
			"A gothic masterpiece chronicling the resilience and independence of Jane Eyre as she confronts societal constraints and secrets at Thornfield Hall.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: Gateshead Hall",
				paragraphs: [
					"There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery an hour in the morning; but since dinner the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further outdoor exercise was now out of the question.",
					"I was glad of it: I never liked long walks, especially on chilly afternoons: dreadful to me was the coming home in the raw twilight, with nipped fingers and toes, and a heart saddened by the chidings of Bessie, the nurse, and humbled by the consciousness of my physical inferiority to Eliza, John, and Georgiana Reed.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: The Window Seat",
				paragraphs: [
					"I mounted into the window-seat: gathering up my feet, I sat cross-legged, like a Turk; and, having drawn the red moreen curtain nearly close, I was shrined in double retirement.",
					"Folds of scarlet drapery shut in my view to the right hand; to the left were the clear panes of glass, protecting, but not separating me from the drear November day. At intervals, while turning over the leaves of Bewick’s Book of British Birds, I looked out on the cold winter rain.",
				],
			},
		},
	},
	{
		title: "Brave New World",
		author: "Aldous Huxley",
		publishYear: 1932,
		genre: "Dystopian Sci-Fi",
		rating: 4.6,
		ratingCount: 220,
		coverTheme: "teal",
		description:
			"A futuristic vision of a technologically advanced society where emotional depth and individuality are sacrificed for stability and conditioning.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: Community, Identity, Stability",
				paragraphs: [
					"A squat grey building of only thirty-four storeys. Over the main entrance the words, CENTRAL LONDON HATCHERY AND CONDITIONING CENTRE, and, in a shield, the World State's motto, COMMUNITY, IDENTITY, STABILITY.",
					"The enormous room on the ground floor faced towards the north. Cold for all the summer beyond the panes, for all the tropical heat of the room itself, a harsh thin light glared through the windows, hungrily seeking some draped lay figure, some pallid shape of academic goose-flesh.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: The Director Speaks",
				paragraphs: [
					"\"And this,\" said the Director opening the door, \"is the Fertilizing Room.\" Bent over their instruments, three hundred Fertilizers were plunged, as the Director of Hatcheries and Conditioning entered the room, in the scarcely breathing silence of work.",
					"A troop of newly arrived students, very young, pink and callow, followed nervously, rather abjectly, at the Director's heels. Each of them carried a notebook, in which, whenever the great man spoke, he desperately scribbled.",
				],
			},
		},
	},
	{
		title: "The Odyssey",
		author: "Homer",
		publishYear: -800,
		genre: "Epic Poetry",
		rating: 4.8,
		ratingCount: 340,
		coverTheme: "navy",
		description:
			"The monumental ancient Greek epic detailing Odysseus’s harrowing ten-year voyage home to Ithaca following the fall of Troy.",
		samplePages: {
			page1: {
				chapterTitle: "Book I: The Council of the Gods",
				paragraphs: [
					"Sing in me, Muse, and through me tell the story of that man skilled in all ways of contending, the wanderer, harried for years on end, after he plundered the stronghold on the proud height of Troy.",
					"He saw the townlands and learned the minds of many distant men, and weathered many bitter nights and days in his deep heart at sea, while he fought only to save his life, to bring his shipmates home.",
				],
			},
			page2: {
				chapterTitle: "Book I: Athena Visits Telemachus",
				paragraphs: [
					"Now all the rest, as many as fled from sheer destruction, were at home, and had escaped both war and sea, but Odysseus only, craving for his wife and for his homecoming, was held by the lady nymph Calypso, that fair goddess, in her hollow caves.",
					"Yet even when the year had come in the turning of the times wherein the gods had ordained that he should return home to Ithaca, even then was he not quit of trials, even among his own folk.",
				],
			},
		},
	},
	{
		title: "Crime and Punishment",
		author: "Fyodor Dostoevsky",
		publishYear: 1866,
		genre: "Psychological Classic",
		rating: 4.9,
		ratingCount: 290,
		coverTheme: "crimson",
		description:
			"A harrowing psychological masterpiece examining the guilt, moral turmoil, and quest for redemption of Raskolnikov in St. Petersburg.",
		samplePages: {
			page1: {
				chapterTitle: "Part 1, Chapter 1: The Hot Evening in July",
				paragraphs: [
					"On an exceptionally hot evening early in July a young man came out of the garret in which he lodged in S. Place and walked slowly, as though in hesitation, towards K. bridge.",
					"He had successfully avoided meeting his landlady on the stairs. His garret was under the roof of a high, five-storied house and was more like a cupboard than a room. The landlady who provided him with room, dinners, and attendance, lived on the floor below, and every time he went out he was obliged to pass her kitchen.",
				],
			},
			page2: {
				chapterTitle: "Part 1, Chapter 1: The Dark Experiment",
				paragraphs: [
					"He had become so completely absorbed in himself, and isolated from his fellows, that he dreaded meeting, not only his landlady, but any one at all. He was crushed by poverty, but the anxieties of his position had of late ceased to weigh upon him.",
					"\"I want to attempt a thing like that and am frightened by these trifles,\" he thought, with an odd smile. \"Hm... yes, all is in a man's hands and he lets it all slip from cowardice, that's an axiom. It would be interesting to know what it is men are most afraid of. Taking a new step, uttering a new word is what they fear most.\"",
				],
			},
		},
	},
	{
		title: "The Catcher in the Rye",
		author: "J.D. Salinger",
		publishYear: 1951,
		genre: "Classic Fiction",
		rating: 4.5,
		ratingCount: 160,
		coverTheme: "amber",
		description:
			"A frank and influential portrait of teenage alienation and search for authenticity in post-war America, voiced by Holden Caulfield.",
		samplePages: {
			page1: {
				chapterTitle: "Chapter 1: Pencey Prep",
				paragraphs: [
					"If you really want to hear about it, the first thing you'll probably want to know is where I was born, and what my lousy childhood was like, and how my parents were occupied and all before they had me, and all that David Copperfield kind of crap, but I don't feel like going into it, if you want to know the truth.",
					"Where I want to start telling is the day I left Pencey Prep. Pencey Prep is this school that's in Agerstown, Pennsylvania. You probably heard of it. You've probably seen the ads, anyway. They advertise in about a thousand magazines, always showing some hotshot guy on a horse jumping over a fence.",
				],
			},
			page2: {
				chapterTitle: "Chapter 1: The Cannon Hill",
				paragraphs: [
					"Anyway, it was the Saturday of the football game with Saxon Hall. The game with Saxon Hall was supposed to be a very big deal around Pencey. It was the last game of the year, and you were supposed to commit suicide or something if old Pencey didn't win.",
					"I remember around three o'clock that afternoon I was standing way up on top of Thomsen Hill, right next to this crazy cannon that was in the Revolutionary War and all. You could see the whole field from up there, and you could see the two teams bashing each other all over the place.",
				],
			},
		},
	},
];

export default books;
