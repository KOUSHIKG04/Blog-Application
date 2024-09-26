import { UserContext } from "@/UserContext";
import axios from "axios";
import { LogOut, Plus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { setUserInfo, UserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const username = UserInfo?.email;

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/profile", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.user;
        setUserInfo(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUserInfo(null);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="flex items-center justify-around p-3  border">
      <div className="text-xl flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>

        <Link to="/" className="logo text-white">
          <img
            src="https://my.blog/wp-content/uploads/2024/05/13921-dotblog.png"
            alt="logo"
            className="h-10"
          />
        </Link>
      </div>

      <div className="flex space-x-4 font-semibold">
        {username && (
          <>
            <Link
              to="/create"
              className="text-sm flex items-center justify-normal cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl transition duration-200"
            >
              <Plus className="mr-2 h-7 w-4" />
              Create New Post
            </Link>
            <button
              onClick={handleLogout}
              className="text-[12px] flex items-center justify-normal cursor-pointer bg-blue-500 hover:bg-red-400 text-white px-4 py-2 rounded-2xl transition duration-200 ml-4"
            >
              <LogOut className="mr-2 h-7 w-4" /> LOGOUT
            </button>
          </>
        )}
        {!username && (
          <>
            <Link
              to="/login"
              className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl"
            >
              LOGIN
            </Link>
            <Link
              to="/register"
              className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl"
            >
              REGISTER
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
