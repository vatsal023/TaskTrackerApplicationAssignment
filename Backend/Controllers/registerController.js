const bcrypt = require("bcrypt")
const {User} = require("../models/userModel.js");
const {validateRegister} = require("../Validation/auth.js");
const {setUser} = require("../service/auth.js");

async function registerController(req,res){
    const {firstName,lastName,email,password} = req.body;
    
    try{
        const {error} = validateRegister(req.body)
         
        if(error){
            return res.status(400).send({ message: error.details[0].message });
        }

        //Check if user with the given email already exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).send({message:"User with given email already exists"});
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password,salt);

        // Save the user with hashed password
        // Set verified to true by default (no email verification needed)
        const user = await new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            verified: true, // Auto-verify users
        }).save();

        // Generate JWT token and set cookie for auto-login
        const token = setUser(user);
        
        // Cookie settings for cross-origin (Vercel frontend → Render backend)
        // httpOnly: false allows js-cookie library to read it on frontend
        // For production: secure must be true, sameSite must be "none" for cross-origin
        const cookieOptions = {
            httpOnly: true, // Allow JavaScript access (needed for js-cookie library)
            secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in dev (HTTP)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in prod, 'lax' for same-origin in dev
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds (better than expires)
            path: "/",      // Available for all paths
            // Don't set domain - let browser handle it automatically
        };

        res.status(201).cookie("authToken", token, cookieOptions).send({
            message: "Registration successful",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });        

    }catch(error){
        console.error("Error in registerController:",error);
        res.status(500).send({message:"Internal Server Error"});
    }
};

module.exports = registerController;
