import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  try {
    //operations
    const { username, email, password } = req.body;

    //check if user is already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    console.log({ newUser });
    return res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  //operations
  try {
    let { email, password } = req.body;

    const isUserExists = await prisma.user.findUnique({ where: { email } });
    if (isUserExists) {
      const isValidPassword = await bcrypt.compare(
        password,
        isUserExists.password
      );
      if (isValidPassword) {
        // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
        
        return res
          .status(200)
          .json({ message: "User logged in successfully", data: isUserExists });
      }
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async () => {
  //operations
  try {
    //clear cookie
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
