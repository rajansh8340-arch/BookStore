import express from "express";
// import {PORT, mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
// import books from "./seedBooks.js";

const app = express();

dotenv.config();

// Middleware for handling CORS policy
// Option1 : For all origins with default of cors(*)
// app.use(cors());

// Option2: Allow custom origins
app.use(
	cors({
		origin: "https://book-store-rose-kappa.vercel.app",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

//  Middleware for parsing request body
app.use(express.json());

//  Middleware for books routes
app.use("/books", bookRoutes);
app.use("/user", userRoutes);

//  Root route
app.get("/", (req, res) => {
	return res.status(234).send("Welcome to Book Store");
});

// const seedBooks = async () => {
// 	try {
// 		await Book.deleteMany({});
// 		await Book.insertMany(books);
// 		console.log("Books seeded successfully.");
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

const PORT = process.env.PORT || 8080;
const mongoDBURL = process.env.MONGODB_URL;
mongoose
	.connect(mongoDBURL)
	.then(() => {
		console.log("Database connected successfully.");
		// await seedBooks();
		app.listen(PORT, () => {
			console.log(`Server running at port: ${PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
