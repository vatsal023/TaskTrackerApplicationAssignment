// const jwt = require("jsonwebtoken");

// async function protect(req){
//     return new Promise((resolve,reject)=>{
//         const token = req.cookies.authToken;
//         if(token){
//             jwt.verify(token,process.env.JWTPRIVATEKEY,{},(err,userData)=>{
//                 if(err){
//                     reject(err);
//                 }
//                 else{
//                     resolve(userData);
//                 }
//             });
//         }else{
//             reject("no token");
//         }
//     });
// }

// module.exports = protect


const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = userData; // ⭐ THIS LINE IS THE MOST IMPORTANT
    next();
  });
}

module.exports = protect;
