import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { errors } = error.response.data;
        errors.forEach((err) => {
          toast.error(`${err.path[0]}: ${err.message}`);
        });
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={register}
        className="flex flex-col max-w-md w-full rounded-lg bg-white shadow-lg p-6 mb-28"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          REGISTER
        </h2>

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-gray-700">
            Username
          </label>
          <Input
            id="username"
            name="username"
            placeholder="Enter your username"
            className="border-gray-300 focus:ring focus:ring-blue-200 rounded-lg"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            className="border-gray-300 focus:ring focus:ring-blue-200 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-gray-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="border-gray-300 focus:ring focus:ring-blue-200 rounded-lg mb-4"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg shadow-md"
        >
          SIGN-UP
        </Button>

        <div className="text-center font-medium mt-4">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
