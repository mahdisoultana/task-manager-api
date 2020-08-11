const User = require("../models/User");
const jwt = require("jsonwebtoken");


const Auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token,process.env.TOKEN);
        const user = await User.findOne({id: decoded._id, "tokens.token": token });

        if (!user) {
            throw new Error("Enable Auth");
        }
        req.user = user;
        req.token=token;
        
        next()
    } catch (e) {
        res.status(401).send({ error: "Please Autentification " })
    }

}


module.exports = Auth;