import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\d{10}$/, "Phone number must be 10 digits"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please fill a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        isAgency: {
            type: String,
            enum: ["yes", "no"],
            required: [true, "Please specify if you are an agency"],
        },
    },
    {
        timestamps: true,
    }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 8)
    next();
});
userSchema.methods.isPasswordCorrect = async function (inputPassword) {
    const isMatch = await bcrypt.compare(inputPassword, this.password)
    return isMatch
}
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return token
}
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const User = mongoose.model("User", userSchema);
export default User;