import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import { useAuth } from "../context/authContext";

const EditTask = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const { isAuthenticated, checkAuth, authChecked } = useAuth();
         
    // First, check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Then, redirect if not authenticated (only after auth check completes)
    useEffect(() => {
        if (authChecked && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, authChecked, navigate]);

  useEffect(() => {

    //fetching task data
    const fetchTask = async () => {
      const res = await axios.get(`/api/tasks/${id}`,{ withCredentials: true });
      setTask(res.data);
    };
    fetchTask();
  }, [id]);
   
  //submitting updated task data
  const handleSubmit = async (data) => {
    await axios.put(`/api/tasks/${id}`,data,{ withCredentials: true });
    navigate("/dashboard");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>
      {task ? <TaskForm initial={task} onSubmit={handleSubmit} /> : <div>Loading...</div>}
    </div>
  );
};

export default EditTask;
