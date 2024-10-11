import User from "../models/userModel.js"
import bcrypt from 'bcryptjs';
import { validateEmail,validatePassword } from "../validations/validations.js";
import { generateToken } from "../config/jwtService.js";





export const userSignup = async (req, res) => {
  const { name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters long" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long, include at least one letter and one number",
    });
  }


  try {

    const userExisted = await User.findOne({ email });
    if (userExisted) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error: ", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long, include at least one letter and one number",
    });
  }

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


 
    const token= generateToken(user)


    user.password = undefined;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 3600000, 
      })
      .status(200)
      .json({ message: "Login successful", user,token });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};