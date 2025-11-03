import React, { useEffect, useState } from "react";
import { api } from "../services/axios";
import { addVideoInPlayList, getAllUserPlayList } from "../API/playlist.api";
import toast from "react-hot-toast";
import { CrossIcon } from "lucide-react";

const PlayListSection = ({ videoId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [playListNames, setPlayListNames] = useState([]);
  const [playListName, setPlayListName] = useState("");

  useEffect(() => {

    const fetchData = async() => {
       const res = await getAllUserPlayList()
       console.log("response of the userPlayList is :", res)
       if(res?.success){
            setPlayListNames(res?.data)
       }else {
            setPlayListNames([])
       }
    } 

    fetchData()
  },[])

    // handle a create a new PlayList
    const handleNewPlayList = async (e) => {
        e.preventDefault()

        try {
            const res = await api.post("/playlist/create-playlist",{
            playListName:playListName
            });
    
            if(res?.data?.StatusCode === 201){
                toast.success(`New PlayLists is Created With Name : ${res?.data?.data?.newPlaylist?.playlistName}`)
            }else {
                toast.error(res?.data?.Message || "There is some Error in creating PlayList")
            }
        } catch (error) {
            console.log("Error While creating New PlayList", error)
        }finally{
            setPlayListName("")
        }
    }

    // handle a add the videos in the playList
    const handleAddVideoInPlayList = async (videoid,playlistId) => {
        const res = await addVideoInPlayList(videoid,playlistId)
        if(res?.data !== null) {
                toast.success(res?.message || "Video Added Successfully")
        }else {
                toast.message(res?.message || "There is error in adding the video into the playList")
        }
    }

  return (
    <div className="relative font-mono">
      {/* Add to Playlist Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-gray-500 cursor-pointer"
      >
        <span className="text-lg"><CrossIcon /></span>
        <span>{isOpen ? "Close Playlist" : "Add"}</span>
      </button>

      {/* Popup / Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-[400px] h-[400px] rounded-2xl shadow-2xl p-5 relative overflow-hidden">
            
            {/* Gradient Header */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 to-blue-500"></div>

            <h2 className="text-lg font-semibold text-gray-800 mt-14 mb-3">
              🎵 Add to Playlist
            </h2>

            {/* Playlist List */}
            {playListNames.length > 0 ? (
              <div>
                <p className="text-gray-600 text-sm mb-2">Select a playlist:</p>
                <ul className="space-y-2 mb-4 max-h-[150px] overflow-y-auto">
                  {playListNames.map((playlist, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition"
                    >
                    <div className="flex gap-5">
                        <span className="text-sm font-bold">{playlist?.playlistName}</span>
                        <p className="text-sm font-semibold">Videos:{ playlist?.videoId.length }</p>
                    </div>

                      <button className="text-blue-600 text-sm font-medium hover:underline"
                        onClick={() => handleAddVideoInPlayList(videoId,playlist?._id)}
                      >
                        Add Video
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Create new playlist form */}
                <form onSubmit={handleNewPlayList} className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New Playlist Name"
                      value={playListName}
                      onChange={(e) => setPlayListName(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-500 transition"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-3">
                  You don’t have any playlists yet.
                </p>
                <form onSubmit={handleNewPlayList} className="flex gap-2 justify-center">
                  <input
                    type="text"
                    placeholder="Enter Playlist Name"
                    value={playListName}
                    onChange={(e) => setPlayListName(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-[200px] focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 transition"
                    onClick={handleNewPlayList}
                  >
                    Create
                  </button>
                </form>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayListSection;
