import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { getTask, updateTask } from "../services/api";
import TaskForm from "../components/TaskForm";
import axios from "axios";
import { useAuth } from "../context/authContext";

const EditTask = () => {
//   const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const { isAuthenticated, checkAuth } = useAuth();
         
    
   useEffect(() => {
            // checkAuth();
            if (!isAuthenticated) {
                navigate("/login");
            }
        }, [])

  useEffect(() => {
    const fetchTask = async () => {
      const res = await axios.get(`/api/tasks/${id}`);
      setTask(res.data);
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (data) => {
    await axios.put(`/api/tasks/${id}`,data);
    navigate("/");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>
      {task ? <TaskForm initial={task} onSubmit={handleSubmit} /> : <div>Loading...</div>}
    </div>
  );
};

export default EditTask;
