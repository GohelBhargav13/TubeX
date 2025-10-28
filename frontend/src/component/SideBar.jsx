import { useNavigate } from "react-router-dom";
import { useUserAuthStore } from "../store/auth.store.js";

// Routes to different Pages
const Routes = [
  { name: "Home", path: "/home" },
  { name: "Liked Videos", path: "/liked" },
  { name: "User Videos", path: "/uvideos" },
  { name: "Login", path: "/login" },
];

const SideBar = () => {
  const navigate = useNavigate();
  const { userData, userLogout } = useUserAuthStore();

  // handle a navigation
  const navigationTo = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Side Panel */}
      <div className="w-60 bg-white shadow-md p-4 flex flex-col space-y-4">
        {/* <h2 className="text-2xl font-bold text-blue-600">TubeX</h2> */}
        <nav className="flex flex-col space-y-2 font-bold">
          {Routes.map((route,idx) =>
            route.name === "Login" && userData ? (
              <button
              key={idx}
                type="submit"
                className="text-left px-3 py-2 hover:bg-gray-200 rounded cursor-pointer font-mono"
                onClick={() => userLogout()}
                title="Logout"
              > Logout</button>
            ) : (
              <button
              key={idx}
              type="submit"
              className="text-left px-3 py-2 hover:bg-gray-200 rounded cursor-pointer font-mono"
              onClick={() => navigationTo(route.path)}
              title={ route.name }
              >{ route.name }</button>
            )
          )}
          { userData?.userRole === "admin" ? (
            <>            
            <h1 className="text-gray-700 p-3 font-bold font-serif"> -- Admin Panel --</h1>
            <button
            type="submit"
            className="text-left px-3 py-2 hover:bg-gray-200 rounded cursor-pointer font-mono"
            onClick={() => navigationTo("/admin/video-upload")}
            title="Video Upload"
            >
              Video Upload
            </button>
            <button
            type="submit"
            className="text-left px-3 py-2 hover:bg-gray-200 rounded cursor-pointer font-mono"
            onClick={() => navigationTo("/admin/video-update")}
            title="Video Update"
            >
              Video Update
            </button>
            </>

          ) : (
            <></>
          )}
        </nav>
      </div>
    </>
  );
};

export default SideBar;
