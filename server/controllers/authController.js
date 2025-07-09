import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPass });
    console.log("[SIGNUP] New user created");

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("[SIGNUP] Access and refresh tokens issued");
    res.status(201).json({
      message: "User created successfully",
      token: accessToken,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error("[SIGNUP] Internal error:", err || err.message);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  const origin = req.headers.origin;
  console.log(`[REFRESH] Incoming refresh request from origin: ${origin}`);
  console.log("Incoming refresh request. Token:");

  if (!token) {
    console.log("No refresh token found in cookies");
    return res.status(204).end();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log(`[REFRESH] Token verified for userId: ${decoded.userId}`);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    console.log("[REFRESH] New access token issued");
    return res.status(200).json({ token: accessToken });
  } catch (err) {
    console.error("[REFRESH] Invalid refresh token:", err.message);
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};
