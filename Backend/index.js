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
// const allowedOrigins = process.env.ALLOWED_ORIGINS 
//     ? process.env.ALLOWED_ORIGINS.split(',')
//     : [
//         "http://localhost:5173",
//         "http://localhost:4000",
//         "http://localhost:3000",
//         "https://task-tracker-application-assignment.vercel.app",
//     ];

// const corsOptions = {
//     origin: (origin, callback) => {
//         // Allow requests with no origin (like mobile apps or curl requests)
//         if (!origin) return callback(null, true);
        
//         if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     optionsSuccessStatus: 204,
//     credentials: true,
// };
// CORS Configuration - supports both development and production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim().replace(/\/$/, ''))
    : [
        "http://localhost:5173",
        "http://localhost:4000",
        "http://localhost:3000",
        "https://task-tracker-application-assignment.vercel.app",
        "https://tasktrackerapplicationassignment-frontend.onrender.com",
    ];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.error("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // required for cookies
}));
// const corsOptions = {
//     origin: (origin, callback) => {
//         // Allow requests with no origin (like mobile apps, Postman, or curl requests)
//         if (!origin) {
//             return callback(null, true);
//         }
        
//         // Remove trailing slash for comparison (browsers don't send trailing slashes in Origin header)
//         const originWithoutSlash = origin.replace(/\/$/, '');
        
//         // Check if origin is in allowed list (compare both with and without trailing slash)
//         const isAllowed = allowedOrigins.some(allowed => {
//             const allowedWithoutSlash = allowed.replace(/\/$/, '');
//             return originWithoutSlash === allowedWithoutSlash || origin === allowed;
//         });
        
//         // In development, allow all localhost origins
//         if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
//             return callback(null, true);
//         }
        
//         if (isAllowed) {
//             callback(null, true);
//         } else {
//             console.error(`❌ CORS blocked origin: ${origin}`);
//             console.error(`✅ Allowed origins:`, allowedOrigins);
//             callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
//         }
//     },
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
//     optionsSuccessStatus: 204,
//     credentials: true, // CRITICAL: Required for cookies to be sent/received
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//     exposedHeaders: ['Set-Cookie'], // Expose Set-Cookie header
// };
// app.use(cors(corsOptions));

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
