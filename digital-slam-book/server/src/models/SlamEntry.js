import mongoose from "mongoose";

const slamEntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: 60
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    batchYear: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    rollNumber: {
      type: String,
      trim: true,
      maxlength: 40
    },
    currentStatus: {
      type: String,
      trim: true,
      maxlength: 120
    },
    currentCity: {
      type: String,
      trim: true,
      maxlength: 80
    },
    socialLink: {
      type: String,
      trim: true,
      maxlength: 220
    },
    memory: {
      type: String,
      trim: true,
      maxlength: 600
    },
    message: {
      type: String,
      trim: true,
      maxlength: 600
    },
    futureGoals: {
      type: String,
      trim: true,
      maxlength: 600
    },
    favoriteTeacher: {
      type: String,
      trim: true,
      maxlength: 120
    },
    adviceForJuniors: {
      type: String,
      trim: true,
      maxlength: 600
    },
    achievements: {
      type: String,
      trim: true,
      maxlength: 600
    },
    image: {
      type: String,
      default: ""
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("SlamEntry", slamEntrySchema);
