import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    playlistName: {
      type: String,
      trim: true,
      required: [true, "Playlist name is Required"],
    },
    videoId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    playlistOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userm",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PlayList = mongoose.model("PlayList", playlistSchema);
export default PlayList;
