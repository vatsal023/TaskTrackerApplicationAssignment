import React from "react";
import { Link } from "react-router-dom";

const statusColor = {
  todo: 'bg-gray-200 text-gray-800',
  'in-progress': 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800'
};

const priorityColor = {
  low: "text-green-600",
  medium: "text-yellow-700",
  high: "text-red-600"
};

const TaskCard = ({ task, onDelete }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between">
      <div>
        <div className="font-bold text-lg">{task.title}</div>
        <div className="text-gray-600 text-sm mb-1">{task.description}</div>
        <div className="flex gap-2 text-xs items-center">
          <span className={`${statusColor[task.status]} px-2 py-1 rounded`}>{task.status}</span>
          <span className={`font-bold ${priorityColor[task.priority]}`}>Priority: {task.priority}</span>
          {task.dueDate && (
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3 sm:mt-0">
        <Link to={`/edit/${task._id}`} className="bg-yellow-400 px-3 py-1 rounded text-xs font-bold hover:bg-yellow-500">Edit</Link>
        <button onClick={() => onDelete(task._id)} className="bg-red-400 px-3 py-1 rounded text-xs font-bold text-white hover:bg-red-600">Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
