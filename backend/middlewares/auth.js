const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    try{
        const token = req.header("auth-token");
        if(!token){
            return res.status(401).json({msg: "No token, authorization denied"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = auth;