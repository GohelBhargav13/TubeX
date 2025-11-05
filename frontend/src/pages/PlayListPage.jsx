import React, { useEffect, useState } from "react";
import SideBar from "../component/SideBar";
import { deletePlayList, FetchUserPlayLists } from "../API/playlist.api";
import VideoPlayer from "../component/VideoPlayer";
import { data, useNavigate } from  "react-router-dom"
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PlayListPage = ({ userData }) => {
  const [playLists, setPlayLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [searchPlayList,setsearchPlayList] = useState("")
  const [filterPlayList,setfilterPlayList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlayLists = async () => {
      setLoading(true);
      try {
        const res = await FetchUserPlayLists();

        // checking if the playlist is not found
        if(res?.StatusCode === 404){
            setPlayLists([])
            filterPlayList([])
            console.log(res?.message)
          return;
        }

        if (res?.success || res?.StatusCode === 200) {
            setPlayLists(res?.data?.userPlaylists || []);
            setfilterPlayList(res?.data?.userPlaylists || [])
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

   // handle search playlist
    const handleSearchPlayList = () => {
        if(searchPlayList.length > 0){
          setfilterPlayList(playLists)
          // console.log("We here.....",filterPlayList)
          
          setfilterPlayList((prev) => { 
            console.log("Previous Data : ", prev)
            return prev.filter((pl) => pl.playlistName.toLowerCase().includes(searchPlayList.toLowerCase())) 
          })

          console.log("Filterd PlayLists : ", filterPlayList.length)
        }else {
          setfilterPlayList(playLists)
        }
    }

    // handle delete PlayList 
    const handleDeletePlayList = async (playListId) => {
       const res = await deletePlayList(playListId)

       // Update a Users PlayList UI
       if(res?.data !== null){
            toast.success("PlayList is Deleted");
            setfilterPlayList(prev => prev?._id !== playListId)
            setLoading(true);

              setTimeout(() => {
                  setLoading(false)
                  window.location.reload()
              },1000)

          return
       }else {
          toast.error(res?.message || "Error While Deleting a playList")
          return
       }
    }

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
  <div className="bg-neutral-50 p-1 flex justify-center items-center font-mono">
        {/* <p>Search Bar</p> */}
        <p className="text-gray-950 p-3 bg-gray-200 rounded">
          Search : {filterPlayList?.length}
        </p>
        <input
          type="text"
          id="search"
          required
          value={searchPlayList}
          onChange={(e) => setsearchPlayList(e.target.value) }
          className="w-1/2 px-4 py-3 m-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
          placeholder="Search PlayList..."
          autoComplete="username"
        />
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleSearchPlayList}
        >
          {" "}
          🔍 Search
        </button>
      </div>  
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
          ) : filterPlayList?.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>No playlists found 😕</p>
              <p className="text-sm mt-2">
                Create your first playlist from any video!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterPlayList?.length > 0 && filterPlayList?.map((playlist) => (
                <div
                  key={playlist?._id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
                >
                  <div className="flex gap-3">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-3 ml-2">
                      {playlist?.playlistName}
                    </h2>
                    <button className="w-full h-2 justify-items-end cursor-pointer" onClick={() => handleDeletePlayList(playlist?._id)}> <Trash2 /> </button>
                  </div>

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
