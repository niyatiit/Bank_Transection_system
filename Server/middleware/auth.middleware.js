import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({
      success: false,
      message: "Unathorized access, token is missing",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decode.userId);

    req.user = user;

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Unathorized access, token is invalid",
    });
  }
};


const authSystemUserMiddleware =async (req,res,next) =>{
  const token = req.headers.authSystemUserMiddleware?.split(" ")[1] || req.cookies.token

  if(!token){
    return res.json({
      success : false , 
      message : "Unauthorized access , token is missing "
    })
  }

  try{
    const decode = jwt.verify(token , process.env.JWT_SECRET_KEY)

    const user = await userModel.findById(decode.userId).select("+systemUser")

    if(!user.systemUser){
      return res.json({
          success : false ,
          message : "Forbidden access , not a system user"
      })
    }

    req.user= user
    return next()
  }
  catch(error)
  {
    return res.json({
      success : false,
      message : "Unathorized token is invalid"
    })
  }

}
export { authMiddleware , authSystemUserMiddleware}