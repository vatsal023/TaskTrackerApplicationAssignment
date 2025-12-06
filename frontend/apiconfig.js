let baseUrl;

// Use VITE_API_URL if set, otherwise check environment
if(import.meta.env.VITE_API_URL){
    baseUrl = import.meta.env.VITE_API_URL;
}
else if(import.meta.env.MODE === 'production' || import.meta.env.VITE_NODE_ENV === 'production'){
    // Production: Replace with your actual backend URL after deployment
    baseUrl = import.meta.env.VITE_BACKEND_URL || "https://your-backend-url.onrender.com";
}
else{
    // Development
    baseUrl = "http://localhost:4000";
}

export {baseUrl};