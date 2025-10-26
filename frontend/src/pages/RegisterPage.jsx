import React, { useState } from "react";
import { userRegister } from "../API/video.api";
import toast from "react-hot-toast";

const RegisterPage = () => {
  // All User state data defined
  const [userFirstName, setFirstName] = useState("");
  const [userLastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userAvatar, setAvatar] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false)


  // handle Registration Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setRegisterLoading(true);

      // make a form data object to send the data to the backend
      const formdata = new FormData();
      formdata.append("userFirstName", userFirstName);
      formdata.append("userLastName", userLastName);
      formdata.append("userEmail", email);
      formdata.append("userPassword", password);
      formdata.append("user_avatar", userAvatar);

      // send the form data to the backend
      const res = await userRegister(formdata);

      if (
        (res?.data !== null && res?.StatusCode === 200) ||
        res?.StatusCode === 201
      ) {
        console.log("Register data response : ", res?.data);
        toast.success(res?.message || "User Registered Successfully");
      } else {
        console.log(res?.message);
        toast.error(res?.message || "User Can't Register");
      }
    } catch (error) {
      setRegisterLoading(false);
      console.log("Error on the RegisterPage.jsx");
      console.log(error);
    }finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
        {/* 💳 The Login Card: Mimics Google's clean, centered card */}
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Header/Logo */}
          <div className="text-center mb-8">
            {/* Using a simple text logo, but you could embed the Google logo SVG */}
            <h1 className="text-2xl font-medium text-gray-800">
              <span className="text-blue-500">T</span>
              <span className="text-red-500">u</span>
              <span className="text-yellow-500">b</span>
              <span className="text-blue-500">e</span>X
            </h1>
            <h2 className="text-xl font-normal text-gray-800 mt-4">Sign up</h2>
            <p className="text-gray-500 text-sm">
              Unlock New Video Experience With TubeX
            </p>
          </div>

          {/* 📝 Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* All Input */}
            <div>
              <label htmlFor="FirstName" className="sr-only">
                FirstName
              </label>
              <input
                type="text"
                id="FirstName"
                value={userFirstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
                placeholder="First Name"
                autoComplete="username"
                title="FirstName"
              />
            </div>

            <div>
              <label htmlFor="LasetName" className="sr-only">
                LastName
              </label>
              <input
                type="text"
                id="LastName"
                value={userLastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 cursor-pointer py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
                placeholder="Last Name"
                autoComplete="username"
                title="LastName"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full cursor-pointer px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
                placeholder="Email"
                autoComplete="username"
                title="Email"
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
                className="w-full cursor-pointer px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
                placeholder="Password"
                autoComplete="current-password"
                title="Password"
              />
            </div>

            <input
              type="file"
              name="UserAvatar"
              accept="image/*"
              className="border p-2 w-full roundxed cursor-pointer"
              onChange={(e) => setAvatar(e.target.files[0])}
              placeholder="Please Upload Your Image"
              title="User Avatar"
              required
            />

            {/* Helper Links */}
            <div className="flex justify-between text-sm">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot email?
              </a>
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sing In
              </a>
            </div>

            {/* 🚀 Submission Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50"
                disabled={
                  !email || !password || !userFirstName || !userLastName
                }
              >
              {registerLoading ? 'processing....' : 'Next' }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
