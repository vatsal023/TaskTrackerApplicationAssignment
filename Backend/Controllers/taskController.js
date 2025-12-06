const Task = require('../models/TaskModel');
const { startOfWeek, endOfWeek } = require('date-fns');

function buildTaskFilter(query, userId) {
  const filter = { user: userId };
  
  // Filter by status/priority
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;

  // Date-based filters (today, this week, overdue)
  if (query.date) {
    const now = new Date();
    if (query.date === 'today') {

       // Tasks due today (00:00 - 23:59)
      filter.dueDate = {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      };
    } else if (query.date === 'week') {

         // Tasks within this week
      filter.dueDate = {
        $gte: startOfWeek(now, { weekStartsOn: 1 }),
        $lte: endOfWeek(now, { weekStartsOn: 1 })
      };
    } else if (query.date === 'overdue') {

        // Past tasks that are not completed
      filter.dueDate = { $lt: now };
      filter.status = { $ne: 'done' };
    }
  }

  
  // Search filter (title + description)
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }
  return filter;
}

const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

        // Build filter object dynamically
    const filter = buildTaskFilter(req.query, userId);

    let q = Task.find(filter);
     
    //sort options
    const allowedSorts = {
      'due_asc': { dueDate: 1 }, 'due_desc': { dueDate: -1 },
      'priority_asc': { priority: 1 }, 'priority_desc': { priority: -1 },
      'created_desc': { createdAt: -1 }, 'created_asc': { createdAt: 1 }
    };

     // Apply sorting, default is newest tasks first
    if (req.query.sort && allowedSorts[req.query.sort]) {
      q = q.sort(allowedSorts[req.query.sort]);
    } else {
      q = q.sort('-createdAt');
    }
    const tasks = await q;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }

  // try {
  //   const userId = req.user._id;
  //   const { status, search } = req.query;
  //   const filter = { user: userId };
  //   if (status) filter.status = status;
  //   if (search) {
  //     filter.$or = [
  //       { title: { $regex: search, $options: 'i' } },
  //       { description: { $regex: search, $options: 'i' } }
  //     ];
  //   }
  //   const tasks = await Task.find(filter).sort('-createdAt');
  //   res.json(tasks);
  // } catch (error) {
  //   res.status(500).json({ message: "Error fetching tasks", error: error.message });
  // }
};

const createTask = async(req,res)=>{
    try {
    const userId = req.user._id;

    //Basic validation
    const { title, description, dueDate, priority, status } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    //Create new task
    const task = await Task.create({ user: userId, title, description, dueDate, priority, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
}

const getTask = async (req, res) => {
  try {

    //Each user can access only their tasks
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {

    //updating user specific task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {

    //delete user specific task
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Dashboard statistics (task count, completed this week, deadlines etc.)
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const tasks = await Task.find({ user: userId });
    const totalTasks = tasks.length;
    const statusCounts = { todo: 0, in_progress: 0, done: 0 };
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    let completedThisWeek = 0;
    let upcomingDeadlines = 0;

    //looping through tasks
    for (const t of tasks) {
      statusCounts[t.status.replace('-', '_')]++;
      priorityCounts[t.priority]++;

      // Count tasks completed this week
      if (t.status === 'done' && t.updatedAt >= weekStart && t.updatedAt <= weekEnd) completedThisWeek++;

       // Count tasks due this week
      if (t.dueDate && t.dueDate >= now && t.dueDate <= weekEnd) upcomingDeadlines++;
    }
    res.json({
      totalTasks, statusCounts, priorityCounts,
      completedThisWeek, upcomingDeadlines
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task stats", error: error.message });
  }
};

module.exports = {getTasks, createTask, getTask, updateTask, deleteTask, getTaskStats};



