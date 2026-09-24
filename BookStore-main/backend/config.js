import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5555;

export const mongoDBURL =
	process.env.MONGODB_URL ||
	process.env.MONGODB_URI ||
	"mongodb+srv://root:1234@books-store-mern.63xn7au.mongodb.net/books-collection?retryWrites=true&w=majority";

export const JWT_SECRET =
	process.env.JWT_SECRET || "bookstore_jwt_secret_key_default";

