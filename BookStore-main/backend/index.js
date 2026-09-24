import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { PORT, mongoDBURL } from "./config.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { Book } from "./models/bookModel.js";
import booksSeed from "./seedBooks.js";

dotenv.config();

const app = express();

// Middleware for handling CORS policy
const isAllowedOrigin = (origin) => {
	if (!origin) return true;
	// Allow all localhost and 127.0.0.1 ports
	if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
		return true;
	}
	// Allow any Vercel deployment (e.g. book-store-4x3z.vercel.app, preview branches, etc.)
	if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
		return true;
	}
	// Allow configured origins from environment variables
	if (process.env.CORS_ORIGIN) {
		const configured = process.env.CORS_ORIGIN.split(",").map((s) => s.trim());
		if (configured.some((c) => origin === c || origin.endsWith(c))) {
			return true;
		}
	}
	return true; // Allow all web origins for public bookstore API
};

app.use(
	cors({
		origin: (origin, callback) => {
			if (isAllowedOrigin(origin)) {
				return callback(null, true);
			}
			return callback(null, true);
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		],
		credentials: true,
	})
);

// Explicit preflight and CORS header fallback middleware
app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (origin) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	} else {
		res.setHeader("Access-Control-Allow-Origin", "*");
	}
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS, PATCH"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-Requested-With, Accept, Origin"
	);

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}
	next();
});

// Explicitly handle all preflight OPTIONS routes
app.options("*", cors());

// Middleware for parsing request body
app.use(express.json());

// Routes
app.use("/books", bookRoutes);
app.use("/user", userRoutes);

// Root route
app.get("/", (req, res) => {
	return res.status(200).json({
		status: "success",
		message: "Welcome to Book Store API",
	});
});

// 404 Handler for undefined routes
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
	console.error("Global Error Handler:", err.stack || err);
	res.status(err.status || 500).json({
		message: err.message || "Internal Server Error",
	});
});

async function seedDatabaseIfEmpty() {
	try {
		const count = await Book.countDocuments();
		if (count === 0 && booksSeed && booksSeed.length > 0) {
			await Book.insertMany(booksSeed);
			console.log(`Seeded ${booksSeed.length} sample books into database.`);
		} else if (count > 0 && booksSeed && booksSeed.length > 0) {
			for (const s of booksSeed) {
				await Book.updateOne(
					{ title: s.title },
					{
						$set: {
							rating: s.rating || 4.8,
							ratingCount: s.ratingCount || 120,
							genre: s.genre || "Classic Literature",
							coverTheme: s.coverTheme || "ocean",
							samplePages: s.samplePages,
						},
					}
				);
			}
			await Book.updateMany(
				{ rating: { $exists: false } },
				{
					$set: {
						rating: 4.8,
						ratingCount: 25,
						genre: "Classic Literature",
						coverTheme: "ocean",
					},
				}
			);
			console.log("Updated sample pages and ratings for all books in database.");
		}
	} catch (seedErr) {
		console.warn("Could not seed or update initial books:", seedErr.message);
	}
}

async function startServer() {
	let connected = false;

	if (
		mongoDBURL &&
		!mongoDBURL.includes("63xn7au.mongodb.net") &&
		!mongoDBURL.includes("<username>")
	) {
		try {
			console.log("Connecting to configured MongoDB database...");
			await mongoose.connect(mongoDBURL, { serverSelectionTimeoutMS: 5000 });
			console.log("Connected to configured MongoDB successfully.");
			connected = true;
		} catch (error) {
			console.warn("Configured MongoDB connection failed:", error.message);
		}
	}

	if (!connected) {
		try {
			console.log("Initializing in-memory MongoDB server for instant setup...");
			const { MongoMemoryServer } = await import("mongodb-memory-server");
			const mongod = await MongoMemoryServer.create();
			const uri = mongod.getUri();
			await mongoose.connect(uri);
			console.log("Connected to in-memory MongoDB successfully!");
			connected = true;
		} catch (memErr) {
			console.error("In-memory MongoDB startup error:", memErr.message);
		}
	}

	if (connected) {
		await seedDatabaseIfEmpty();
	} else {
		console.warn("Database connection pending. Operations requiring database will buffer/fail.");
	}

	const server = app.listen(PORT, () => {
		console.log(`Server running at port: ${PORT}`);
	});

	server.on("error", (err) => {
		if (err.code === "EADDRINUSE") {
			console.warn(`Port ${PORT} is already in use by another instance.`);
		} else {
			console.error("Server error:", err);
		}
	});
}

startServer();
