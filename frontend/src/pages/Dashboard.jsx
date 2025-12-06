import React, { useEffect, useState, useContext } from "react";
import TaskCard from "../components/TaskCard";
import { Link,useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import FilterPanel from "../components/FilterPanel";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "", date: "", search: "" });
  const [sort, setSort] = useState(() => localStorage.getItem('taskSort') || "created_desc");
  // const [filter, setFilter] = useState("");
  // const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
     const { isAuthenticated, checkAuth } = useAuth();
           const navigate = useNavigate();
  
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

        // Sync filters and sorting with the URL
         useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => v && params.append(k,v));
    if (sort) params.set('sort', sort);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    // Save sort in localStorage
    localStorage.setItem('taskSort', sort);
  }, [filters, sort]);

    // On mount, parse existing URL to set initial state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      status: params.get('status')||"",
      priority: params.get('priority')||"",
      date: params.get('date')||"",
      search: params.get('search')||""
    });
    setSort(params.get('sort')||localStorage.getItem('taskSort')||"created_desc");
   
  }, []);
  
  //fetching tasks data based on filters and sort
  const fetchTasks = async () => {
    setLoading(true);
    setTasks([]);
    try {
      const res = await axios.get("/api/tasks",{
        params: {
        ...filters,sort}
      }); 
      console.log(res.data);
      setTasks(res.data);
    } catch {
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
 
  }, [filters, sort]);
  
  //deleting a task
  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Link to="/create" className="bg-blue-500 text-white rounded p-2 font-bold hover:bg-blue-600">
          + New Task
        </Link>
      </div>
       
      <FilterPanel
        filters={filters} setFilters={setFilters}
        sort={sort} setSort={setSort} onApply={fetchTasks}
      />
      {/* <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <select
          className="border rounded p-2"
          value={filter}
          onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          className="border rounded p-2 flex-1"
          placeholder="Search by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div> */}
      {loading ? (
        <div>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-600 mt-8">No tasks found.</div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
