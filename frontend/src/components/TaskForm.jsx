import React, { useState } from "react";

const TaskForm = ({ initial = {}, onSubmit }) => {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    dueDate: initial.dueDate ? initial.dueDate.split("T")[0] : "",
    priority: initial.priority || "medium",
    status: initial.status || "todo"
  });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSubmit({ ...form, dueDate: form.dueDate ? new Date(form.dueDate) : undefined });
  };

  return (
    <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
      <input name="title" placeholder="Title *" className="w-full border rounded p-2"
        value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description"
        className="w-full border rounded p-2"
        value={form.description} onChange={handleChange} rows={3} />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs mb-1 font-semibold">Due Date</label>
          <input name="dueDate" type="date" className="w-full border rounded p-2"
            value={form.dueDate} onChange={handleChange} />
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1 font-semibold">Priority</label>
          <select name="priority" className="w-full border rounded p-2"
            value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs mb-1 font-semibold">Status</label>
          <select name="status" className="w-full border rounded p-2"
            value={form.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <button className="bg-blue-500 text-white rounded font-bold p-2 hover:bg-blue-600" type="submit">
        Save
      </button>
    </form>
  );
};

export default TaskForm;
