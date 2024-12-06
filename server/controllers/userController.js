import userModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name | !email | !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    }
    
    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.json({success: true, token, user: {name: user.name}})

    ;
  } catch (error) {
    console.log(error);
    res.json({success:false, message: error.message})
    
  }
};
const loginUser = async (req,res)=>{
    try {
        console.log('Request Body:', req.body); // Log the body
        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false, message: 'User does not exist'})
        }

        const isMatch = await bcryptjs.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

            res.json({success: true, token, user: {name: user.name}})
        }else {
            return res.json({success:false, message: 'Invalid credentials'})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}
const userCredits = async (req,res)=>{
    try {
        
        const {userId} = req.body

        const user = await userModel.findById(userId)

        res.json({success:true, credits: user.creditBalance, user: {name: user.name}})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

export {registerUser, loginUser, userCredits}