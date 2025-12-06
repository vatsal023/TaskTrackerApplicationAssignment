import { useState, useEffect } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/authContext";
import axios from "axios";
import { baseUrl } from '../apiconfig';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import CreateTask from './pages/CreateTask.jsx';
import EditTask from './pages/EditTask.jsx';
import Dashboard from './pages/Dashboard.jsx';
import VerifyEmail from './pages/verifyEmail.jsx';
import Navbar from './components/Navbar.jsx';
import DashboardStats from './pages/DashboardStats.jsx';
import Home from './pages/Home.jsx';

const Layout = () => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    console.log("Layout effect")
  }, [isAuthenticated]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <ScrollRestoration />
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // {
      //   path: "dashboard",
      //   element: <Dashboard />,
      // },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "create",
        element: <CreateTask />,
      },
      {
        path: "users/:id/verify/:token",
        element: <VerifyEmail />, 
      },
      {
        path: "edit/:id",
        element: <EditTask />,
      },
      {
        path: "dashboard-stats",
        element: <DashboardStats />,
      },
    ],
  },
]);

function App() {
  axios.defaults.baseURL = baseUrl;
  axios.defaults.withCredentials = true;

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App
