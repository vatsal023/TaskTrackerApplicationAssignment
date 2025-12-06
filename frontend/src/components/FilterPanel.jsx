import React, { useState } from "react";

const priorities = ["low", "medium", "high"];
const statuses = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" }
];
const dateFilters = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "overdue", label: "Overdue" }
];
const sortOptions = [
  { value: "created_desc", label: "Newest" },
  { value: "created_asc", label: "Oldest" },
  { value: "due_asc", label: "Due Date ↑" },
  { value: "due_desc", label: "Due Date ↓" },
  { value: "priority_asc", label: "Priority Low→High" },
  { value: "priority_desc", label: "Priority High→Low" }
];

export default function FilterPanel({ filters, setFilters, sort, setSort, onApply }) {
  const [open, setOpen] = useState(false);

  const handleChange = e => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSort = e => setSort(e.target.value);
  const clearFilters = () => setFilters({ status: "", priority: "", date: "", search: "" });

  return (
    <div className="mb-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded-md mb-2 font-bold"
        onClick={() => setOpen(o => !o)}>
        {open ? "Hide" : "Show"} Filters & Sort
      </button>
      {open && (
        <div className="bg-white p-4 rounded-md shadow grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold">Priority:</label>
              <select name="priority" value={filters.priority} onChange={handleChange} className="block w-full border rounded p-2 mt-1">
                <option value="">All</option>
                {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold">Status:</label>
              <select name="status" value={filters.status} onChange={handleChange} className="block w-full border rounded p-2 mt-1">
                <option value="">All</option>
                {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold">Due Date:</label>
              <select name="date" value={filters.date} onChange={handleChange} className="block w-full border rounded p-2 mt-1">
                <option value="">All</option>
                {dateFilters.map(df => <option key={df.value} value={df.value}>{df.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <input
              name="search"
              value={filters.search}
              onChange={handleChange}
              className="flex-1 border rounded p-2"
              placeholder="Search by title or description..."
            />
            <button type="button" className="text-xs px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" onClick={clearFilters}>Clear</button>
          </div>
          <div>
            <label className="font-semibold">Sort By:</label>
            <select name="sort" value={sort} onChange={handleSort} className="block w-full border rounded p-2 mt-1">
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <button className="bg-blue-500 px-4 py-2 text-white rounded font-bold hover:bg-blue-600" onClick={onApply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
