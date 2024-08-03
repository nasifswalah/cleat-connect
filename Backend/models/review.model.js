import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    postedFor: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    }
})

const Review = mongoose.model('review', reviewSchema);
export default Review;