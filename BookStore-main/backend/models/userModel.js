import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            }
        ]
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);