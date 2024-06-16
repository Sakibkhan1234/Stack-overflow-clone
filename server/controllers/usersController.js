// const User = require('../models/User');
import user from "../models/auth.js";

// Controller to get all users
export const getAll= async (req, res) => {
  try {
    const users = await user.find().select('name'); // Select only the name field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

