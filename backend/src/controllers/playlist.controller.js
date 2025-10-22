import mongoose from "mongoose";
import PlayList from "../models/playlist.models.js";
import Userm from "../models/user.models.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import Video from "../models/video.models.js";

// Create a PlayList
export const createPlayList = async (req, res) => {
  const { playListName } = req.body;
  try {
    if (!playListName) {
      return res
        .status(404)
        .json(new ApiError(404, "Playlist name is required"));
    }

    const existingPlayList = await PlayList.findOne({
      playlistName: playListName,
    });

    if (existingPlayList) {
      return res
        .status(400)
        .json(new ApiError(400, "PlayList is already exist"));
    }

    const NewPlaylist = await PlayList.create({
      playlistName: playListName,
      playlistOwner: req.user?._id,
    });

    if (!NewPlaylist) {
      return res
        .status(400)
        .json(new ApiError(400, "Error in creating PlayList"));
    }

    res
      .status(201)
      .json(new ApiResponse(201, NewPlaylist, "PlayList Created Successfully"));
  } catch (error) {
    console.log("Error while creating PlayList : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in creating PlayList"));
  }
};

// Add the video in the playlist
export const addVideoInPlayList = async (req, res) => {
  const { vId, playlistId } = req.params;
  try {
    if (!vId || !playlistId) {
      return res
        .status(404)
        .json(new ApiError(404, "VideoId and PlayListId is required"));
    }

    const playlist = await PlayList.findById(playlistId).populate("videoOwner","userFirstName");
    if (!playlist) {
      return res.status(404).json(new ApiError(404, "PlayList is not found"));
    }

    // main Logic of the add in the playlist
    if(!playlist.videoId.includes(vId)){
         playlist.videoId.push(vId);

        //  const videoOwner = await Video.findById({ _id:vId })
        //  console.log("Video Deatils are : ",videoOwner)

         await playlist.save();

         res.status(200).json(new ApiResponse(200,{ playlist,VideosCount:playlist.videoId.length },"Video Added Successfully"))
         return;
    }else{

        playlist.videoId = playlist.videoId.filter((id) => id.toString() !== vId.toString());
        await playlist.save();
        
        res.status(200).json(new ApiResponse(200,{ playlist,VideosCount:playlist.videoId.length },"Video Removed Successfully"))

    }

    // Another Logic only Add logic
    // await PlayList.findByIdAndUpdate(playlistId, { $push: { videoId:videoId } })

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video Added in PlayList"));
  } catch (error) {
    console.log("Error while adding video in PlayList : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in adding video in PlayList"));
  }
};

// fetch the user playlists
export const getUserPlaylists = async (req, res) => {
  const { id } = req.user;
  try {
    const userPlaylists = await PlayList.find({ playlistOwner: id })
    // console.log(userPlaylists[0].playlistOwner)

    const user = await Userm.findById(id).select("userFirstName userLastName __id userEmail");
    if (userPlaylists.length === 0) {
      return res.status(404).json(new ApiError(404, "No PlayList Found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { userPlaylists,user }, "PlayLists Fetched Successfully")
      );
  } catch (error) {
    console.log("Error while fetch user Playlist : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching user PlayList"));
  }
};

// delete the playlist
export const deletePlayList = async (req, res) => {
  const { playlistId } = req.params;
  try {
    if (!playlistId) {
      return res.status(404).json(new ApiError(404, "PlaylistId is required"));
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      return res.status(404).json(new ApiError(404, "PlayList is not found"));
    }

    await PlayList.findByIdAndDelete(playlistId);

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "PlayList Deleted Successfully"));
  } catch (error) {
    console.log("Error in deleteing PlayList : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in deleting PlayList"));
  }
};
