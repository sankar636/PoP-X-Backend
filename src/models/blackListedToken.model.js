import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 //Lasting 24 hours in seconds
    }
});

const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
export default BlacklistedToken;
