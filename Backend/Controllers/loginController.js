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
        const cookieOptions = {
            // httpOnly: true, // Prevents XSS attacks - JavaScript cannot access this cookie
            httpOnly:false,
            secure: true,   // Required for HTTPS and sameSite: "none"
            sameSite: "none", // Required for cross-origin cookies (different domains)
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            path: "/",      // Available for all paths on the domain
            // Don't set domain - let browser handle it for cross-origin
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