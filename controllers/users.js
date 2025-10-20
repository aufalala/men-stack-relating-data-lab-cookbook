const mongoose = require('mongoose');
const User = require('../models/Users.js');
const Recipe = require('../models/recipe.js');


const getAllUsers = async (req, res) => {
try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (e) {
    console.error("Error getting users:", e);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

const getUsersRecipe = async (req, res) => {
  const userId = req.params.userId;

  try {
    const recipes = await Recipe.find({ owner: userId }).select("-__v")
      .populate('owner', 'username')
      .populate('ingredients', 'name');

    res.json(recipes);

  } catch (e) {
    console.error("Error getting user's recipes:", e);
    res.status(500).json({ error: "Failed to fetch user's recipes" });
  }
}

module.exports = { getAllUsers, getUsersRecipe};