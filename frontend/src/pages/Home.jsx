import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Task Tracker</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-xl">
        Task Tracker is your simple, efficient solution to manage daily tasks and boost productivity.<br/>
        Create, update, track and organize your work.<br/> Your tasks, managed, anywhere.
      </p>
      {!isAuthenticated ? (
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="bg-blue-500 text-white py-2 px-6 rounded font-bold hover:bg-blue-600">
            Login
          </Link>
          <Link to="/register" className="bg-gray-300 text-blue-700 py-2 px-6 rounded font-bold hover:bg-gray-400">
            Register
          </Link>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-800"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      )}
    </div>
  );
}
