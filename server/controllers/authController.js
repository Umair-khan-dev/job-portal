import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getSecret = () => process.env.JWT_SECRET || "dev_secret";

const signToken = (id) =>
  jwt.sign({ id: String(id) }, getSecret(), {
    expiresIn: "30d",
  });

const sendUser = (user, token) => {
  const data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    skills: user.skills,
    experienceLevel: user.experienceLevel,
    resume: user.resume,
    profilePicture: user.profilePicture,
  };
  if (token) data.token = token;
  return data;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role === "admin" ? "admin" : "candidate",
    });

    const token = signToken(user._id);
    res.status(201).json(sendUser(user, token));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    res.json(sendUser(user, token));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  res.json(sendUser(req.user, null));
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, skills, experienceLevel } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (skills) {
      user.skills = Array.isArray(skills)
        ? skills
        : String(skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (req.body.resume) user.resume = req.body.resume;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

    await user.save();
    res.json(sendUser(user, null));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
