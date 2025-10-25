import { useNavigate } from "react-router-dom";
import { useUserAuthStore } from "../store/auth.store.js";

// Routes to different Pages
const Routes = [
  { name: "home", path: "/home" },
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
        <h2 className="text-2xl font-bold text-blue-600">TubeX</h2>
        <nav className="flex flex-col space-y-2 font-bold">
          {Routes.map((route) =>
            route.name === "Login" && userData ? (
              <button
                type="submit"
                className="text-left px-3 py-2 hover:bg-gray-200 rounded"
                onClick={() => userLogout()}
              > Logout</button>
            ) : (
              <button
              type="submit"
              className="text-left px-3 py-2 hover:bg-gray-200 rounded"
              onClick={() => navigationTo(route.path)}
              >{ route.name }</button>
            )
          )}
        </nav>
      </div>
    </>
  );
};

export default SideBar;
