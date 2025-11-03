import React, { useEffect, useState } from "react";
import SideBar from "../component/SideBar";
import { FetchUserPlayLists } from "../API/playlist.api";
import VideoPlayer from "../component/VideoPlayer";
import { useNavigate } from  "react-router-dom"

const PlayListPage = ({ userData }) => {
  const [playLists, setPlayLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlayLists = async () => {
      setLoading(true);
      try {
        const res = await FetchUserPlayLists();

        if (res?.success) {
          setPlayLists(res?.data?.userPlaylists || []);
        } else {
          setPlayLists([]);
        }
      } catch (error) {
        console.log("❌ Error while fetching playlists:", error);
        setPlayLists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayLists();
  }, []);

  // Handle a Toogle of the shoe menu
  const handleToogle = () => setIsShow((prev) => !prev);

  return (
    <div className="min-h-screen bg-neutral-50 font-mono">
      {/* Header */}
      <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-blue-600">TubeX</h1>
        <div className="flex items-center space-x-3">
          <p className="font-medium">
            {userData?.userFirstName} {userData?.userLastName}
          </p>
          <img
            src={userData?.user_avatar || "https://via.placeholder.com/40"}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      {/* Body */}
      <div className="flex gap-3 w-full px-3">
        <SideBar />

        {/* Playlist Section */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold text-center mb-4">
            Your Playlists
          </h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading playlists...</p>
          ) : playLists.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>No playlists found 😕</p>
              <p className="text-sm mt-2">
                Create your first playlist from any video!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playLists.map((playlist) => (
                <div
                  key={playlist?._id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
                >
                  <h2 className="text-lg font-semibold text-indigo-600 mb-3">
                    {playlist?.playlistName}
                  </h2>

                  {playlist?.videoId?.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      { !isShow && playlist?.videoId?.length > 2 ? (
                        <div className="text-slate-500 text-sm">Videos Are In PlayList {playlist?.videoId?.length}</div>
                      ) : (

                        playlist.videoId.map((video) => (
                          <div key={video?._id}>
                            <VideoPlayer videoURL={video?.videoUrl} />
                            <div className="cursor-pointer" onClick={() => navigate(`/watch/${video?._id}`)}>
                            <p className="text-sm text-gray-700 mb-1 mt-2">
                              🎬 {video?.videoTitle}
                            </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm font-mono">
                      No videos in this playlist yet.
                    </p>
                  )}
                   <button
                    className={`${
                      playlist?.videoId?.length <= 2 ? "hidden" : "block"
                    } flex gap-2 text-sm cursor-pointer text-slate-600`}
                    onClick={handleToogle}
                  >
                   <p className="hover:underline"> { !isShow && playlist?.videoId?.length > 2 ? 'show' : 'showLess' } </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PlayListPage;
