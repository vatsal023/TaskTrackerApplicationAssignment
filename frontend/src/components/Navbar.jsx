import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to Home
  };

  return (
    <nav className="bg-white shadow px-4 py-3 mb-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          Task Tracker
        </Link>
        <div className="flex gap-4 items-center">
          {isAuthenticated && (
            <Link
              to="/dashboard-stats"
              className={
                (location.pathname === "/dashboard-stats"
                  ? "font-bold text-indigo-600 underline "
                  : "text-blue-500 hover:underline") + " text-sm"
              }
            >
              Analytics
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">
                Hello, {user?.firstName ?? "User"} {user?.lastName ?? ""}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="text-blue-500 hover:underline text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-blue-500 hover:underline text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
