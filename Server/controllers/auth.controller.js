import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendRegisterationEmail } from "../services/email.service.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.send({ success: false, message: "Fillups all Data " });
    }

    const isExists = await userModel.findOne({
      email: email,
    });

    if (isExists) {
      return res.json({
        success: false,
        message: "User is already logedin please try again ",
      });
    }

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY /* {expiresIn : "3d" } */,
    );

    res.cookie("token", token);

    await sendRegisterationEmail(user.email , user.name)

    return res.json({
      success: true,
      message: "User Register Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Please Fill All Data" });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.json({ success: false, message: "email is not Valid" });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Password does't match please reenter the  password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    return res.json({
      success: true,
      message: "Loggedin Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export { register, login };
