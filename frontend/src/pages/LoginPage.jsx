import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../services/axios.js";
import { useUserAuthStore } from "../store/auth.store.js";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData,userData } = useUserAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting to log in with:", { email, password });

    // Calling the actual user login method with this credential
    const formData = {
      userEmail: email,
      userPassword: password,
    };

    const res = await api.post("/user/login", formData);
    console.log(res);

    if (res.data.StatusCode === 200 || res.data.StatusCode === 201) {
        console.log("Login successful, updating Zustand store");
      await setUserData(); // fetch /user/me and set user data
        toast.success(res.data.message || "Login successful");
        navigate("/home");

    } else {
      toast.error(res.data.message || "Login failed");
    }
  };

  return (
    // Centering the form in the middle of the screen
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* 💳 The Login Card: Mimics Google's clean, centered card */}
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header/Logo */}
        <div className="text-center mb-8">
          {/* Using a simple text logo, but you could embed the Google logo SVG */}
          <h1 className="text-2xl font-medium text-gray-800">
            <span className="text-blue-500">S</span>
            <span className="text-red-500">t</span>
            <span className="text-yellow-500">r</span>
            <span className="text-blue-500">e</span>
            <span className="text-green-500">a</span>
            <span className="text-red-500">m</span>
            Tube
          </h1>
          <h2 className="text-xl font-normal text-gray-800 mt-4">Sign in</h2>
          <p className="text-gray-500 text-sm">to continue to StreamTube</p>
        </div>

        {/* 📝 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email or phone
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
              placeholder="Email or phone"
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>

          {/* Helper Links */}
          <div className="flex justify-between text-sm">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Forgot email?
            </a>
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create account
            </a>
          </div>

          {/* 🚀 Submission Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50"
              disabled={!email || !password}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
