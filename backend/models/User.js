import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // Personal Information for Signup
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },

    // User Activity
    watchHistory: [
      {
        movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Movie',  // Reference to a Movie model if needed
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    likedMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],

    starredMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model('User', UserSchema);
