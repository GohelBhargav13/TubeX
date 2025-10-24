import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./utills/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";


function App() {
  
  return (

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
      {/* <Route path="*" element={ <Navigatex` to="/login" /> } /> */}
    </Routes>
  );
}

export default App;
