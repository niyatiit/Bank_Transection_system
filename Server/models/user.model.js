import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requierd for createing the account"],
    },
    email: {
      type: String,
      required: [true, "Email is requierd for creating a user"],
      trim: true,
      lowercase: true,
      unique: [true, "Email is already exists"],
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Invalid Email Address"],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating the account"],
      unique: true,
      minlength: [6, "Password should be more than 6 character"],
      select: false,
    },
    systemUser : {
      type : Boolean,
      default : false,
      immutable : true, //this is only created by the system and not be changed by the user
      select : false, //this is not be shown to the user
    }
  },
  { timestamps: true },
);

//Before the saving the document , run this function first
userSchema.pre("save", async function () {
  //check whether password was changed or not
  if (!this.isModified("password")) {
    return ;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  return ;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
