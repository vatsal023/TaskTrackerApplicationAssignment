import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { createTask } from "../services/api";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

const CreateTask = () => {
//   const { token } = useContext(AuthContext);
  const navigate = useNavigate();
     const { isAuthenticated, checkAuth } = useAuth();
  
    // First, check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Then, redirect if not authenticated (after auth check completes)
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);
  
  //submitting new task data
  const handleSubmit = async (data) => {
    await axios.post("/api/tasks",data);
    navigate("/dashboard");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Task</h2>
      <TaskForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateTask;
