const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const connection  = require('./db/db.js')
const path = require("path");
const authRoutes = require("./routes/authRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");

const app = express();

connection();

app.use(cookieParser());
app.use(express.json());

// CORS Configuration - supports both development and production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        "http://localhost:5173",
        "http://localhost:4000",
        "http://localhost:3000",
        "https://task-tracker-application-assignment.vercel.app",
    ];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
    credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Tracker API is running');
});

// Use environment variable for PORT, fallback to 4000 for development
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
