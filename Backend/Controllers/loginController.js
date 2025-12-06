const {User} = require("../models/userModel");
const {validateLogin} = require("../Validation/auth.js")
const {setUser} = require("../service/auth.js")
const bcrypt = require("bcrypt");

async function loginController(req,res){
    try{
        const {error} = validateLogin(req.body);

        if(error){

            return res.status(400).send({message:error.details[0].message});
            // return res.status(400).send({message:"Hello"});
        }

        //Find the user by email
        const user = await User.findOne({email:req.body.email});
        
        if(!user){
            return res.status(401).send({message:"Invalid Email"});
        }
        
        //Check password validity using bcrypt
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword){
            return res.status(401).send({message:"Invalid Password"});
        }

        // No email verification required - users can login immediately after registration

        const token = setUser(user);
        
        // Cookie settings for cross-origin (Vercel frontend → Render backend)
        // httpOnly: false allows js-cookie library to read it on frontend
        // For production: secure must be true, sameSite must be "none" for cross-origin
        const cookieOptions = {
            httpOnly: false, // Allow JavaScript access (needed for js-cookie library)
            secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in dev (HTTP)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in prod, 'lax' for same-origin in dev
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds (better than expires)
            path: "/",      // Available for all paths
            // Don't set domain - let browser handle it automatically
        };
        
        res.status(200).cookie("authToken", token, cookieOptions).send({
            message:"Login successful",
            status:200,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        return;
    }catch(error){
        console.error("Error in loginController:",error);
        res.status(500).send({message:"Internal Server Error"});
    }
}

module.exports = loginController;