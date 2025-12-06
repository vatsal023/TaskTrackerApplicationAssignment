let baseUrl;

// Priority order:
// 1. VITE_API_URL environment variable (set in Vercel - RECOMMENDED)
// 2. Hardcoded production URL (fallback)
// 3. Development default (localhost)

if(import.meta.env.VITE_API_URL){
    // Use environment variable if set (best practice)
    baseUrl = import.meta.env.VITE_API_URL;
}
else if(import.meta.env.MODE === 'production' || import.meta.env.PROD){
    // Production build - use your Render backend URL
    baseUrl = "https://tasktrackerapplicationassignment.onrender.com";
}
else{
    // Development mode
    baseUrl = "http://localhost:4000";
}

// Remove trailing slash if present (important for consistency)
baseUrl = baseUrl.replace(/\/$/, '');

export {baseUrl};