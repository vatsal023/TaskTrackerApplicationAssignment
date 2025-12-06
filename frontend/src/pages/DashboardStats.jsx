import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import axios from "axios";
const statusColors = ["#60a5fa", "#fde047", "#34d399"];
const priorityColors = ["#fbbf24", "#f59e42", "#ef4444"];
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const DashboardStats = () =>{

  const [stats, setStats] = useState(null);
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
  
  //fetching stats data
  useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/tasks/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  fetchStats();
}, []);
  

  if (!stats) return <div>Loading...</div>;

  const statusData = [
    { name: 'To Do', value: stats.statusCounts.todo },
    { name: 'In Progress', value: stats.statusCounts.in_progress },
    { name: 'Done', value: stats.statusCounts.done }
  ];
  const priorityData = [
    { name: 'Low', value: stats.priorityCounts.low },
    { name: 'Medium', value: stats.priorityCounts.medium },
    { name: 'High', value: stats.priorityCounts.high }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <div className="text-3xl font-bold">{stats.totalTasks}</div>
          <div className="text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <div className="text-3xl font-bold">{stats.completedThisWeek}</div>
          <div className="text-gray-600">Completed This Week</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <div className="text-3xl font-bold">{stats.upcomingDeadlines}</div>
          <div className="text-gray-600">Upcoming Deadlines</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                {statusData.map((entry, idx) => <Cell key={idx} fill={statusColors[idx]}/>) }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="value" fill="#6366f1">
                {priorityData.map((entry, idx) => <Cell key={idx} fill={priorityColors[idx]}/>) }
              </Bar>
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;