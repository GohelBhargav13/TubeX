import React, { useEffect, useState } from "react";
import SideBar from "../component/SideBar";
import { deletePlayList, FetchUserPlayLists } from "../API/playlist.api";
import VideoPlayer from "../component/VideoPlayer";
import { data, useNavigate } from  "react-router-dom"
import { MenuIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "../component/UserAvatar";

const PlayListPage = ({ userData }) => {
  const [playLists, setPlayLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [searchPlayList,setsearchPlayList] = useState("")
  const [filterPlayList,setfilterPlayList] = useState([])
  const [sidebarShow,setSideBar] = useState(false)
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
    <div className="min-h-screen bg-linear-to-b from-gray-800 to-black font-mono">
      {/* Header */}
      <header className="h-16 bg-gray-950 text-white flex items-center justify-between px-6 shadow-sm">
        <h1 className="text-2xl font-bold">TubeX</h1>
        <div className="flex items-center space-x-3">
          <p className="font-medium">
            {userData?.userFirstName} {userData?.userLastName}
          </p>
              <UserAvatar username={userData?.userFirstName} />
        </div>
      </header>
 <div className="bg-gray-900 flex font-mono lg:items-center lg:justify-center">
      <button className="text-white p-1 mr-10 justify-items-start hover:cursor-pointer" onClick={() => setSideBar((prev) => !prev) }>
          <MenuIcon />
        </button>
        {/* <p>Search Bar</p> */}
        <p className="text-gray-950 text-sm md:p-2 hidden md:block py-1 px-2 bg-gray-200 rounded">
          Search: {filterPlayList?.length}
        </p>
        <input
          type="text"
          id="search"
          required
          value={searchPlayList}
          onChange={(e) => setsearchPlayList(e.target.value)}
          className="w-1/2 h-1/2 px-2 py-1 md:px-3 md:py-3 lg:px-3 lg:py-4 m-2 justify-items-center border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150"
          placeholder="Search videos..."
          autoComplete="username"
        />
        <button
          className="bg-gray-800 hover:bg-gray-950 hover:scale-105 duration-700 text-white font-bold py-1 px-2 md:py-2 md:px-3 rounded cursor-pointer"
          onClick={handleSearchPlayList}
        >
          {" "}
          <div className="flex">🔍 <p className="sm:hidden hidden md:block">Search</p></div>
        </button>
      </div>
      {/* Body */}
      <div className="flex min-h-screen gap-3 w-fit px-3">
       { 
        sidebarShow && 
          <div className="w-0.5/4 bg-gray-950 relative z-20 border-r-2 border-white text-sm md:text-lg">
            <SideBar />
          </div>
        }

        {/* Playlist Section */}
        <main className={`flex-1 flex flex-col transition-all duration-300 
               ${sidebarShow ? "absolute w-3/4" : "relative left-0 w-full"}`}>
          <h1 className={`text-sm md:text-lg mt-2 md:mt-1  font-bold text-center mb-4 text-white`}>
            Your Playlists
          </h1>

          {loading ? (
            <p className="text-center text-white">Loading playlists...</p>
          ) : filterPlayList?.length === 0 ? (
            <div className="text-center text-neutral-300">
              <p>No playlists found 😕</p>
              <p className="text-sm mt-2">
                Create your first playlist from any video!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filterPlayList?.length > 0 && filterPlayList?.map((playlist) => (
                <div
                  key={playlist?._id}
                  className="bg-gray-800 text-white w-[345px] md:w-[500px] lg:w-[350px]  relative hover:scale-105 duration-500 hover:bg-slate-900 hover:font-bold rounded-lg shadow hover:shadow-md transition p-2"
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
                        <div className="text-neutral-400 text-sm">Videos Are In PlayList {playlist?.videoId?.length}</div>
                      ) : (
                        playlist.videoId.map((video) => (
                          <div key={video?._id} className=" hover:bg-slate-900 hover:scale-105 duration-500 p-2 rounded-xl">
                            <VideoPlayer videoURL={video?.videoUrl} />
                            <div className="cursor-pointer" onClick={() => navigate(`/watch/${video?._id}`)}>
                            <p className="text-sm mb-1 mt-2">
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
                   <p className="hover:underline text-white mt-2"> { !isShow && playlist?.videoId?.length > 2 ? 'show' : 'showLess' } </p>
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
