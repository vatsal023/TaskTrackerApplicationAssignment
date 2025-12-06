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
  
    useEffect(() => {
          
            // checkAuth();
            if (!isAuthenticated) {
                navigate("/login");
            }
        }, [])
  
  //submitting new task data
  const handleSubmit = async (data) => {
    await axios.post("/api/tasks",data);
    navigate("/");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Task</h2>
      <TaskForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateTask;
