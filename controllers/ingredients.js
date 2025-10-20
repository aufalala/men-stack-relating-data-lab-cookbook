const mongoose = require('mongoose');
const Ingredient = require('../models/ingredient.js');


const getIngredients = async (req, res) => {  
  try {
    const ingredients = await Ingredient.find({});
    res.json({
      ingredients,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ err: e.message });
  }
};

const createIngredients = async (req, res) => {
  const ingredient = {
    name: req.body.name,
  }

  try {
    const newIngredient = await Ingredient.create(ingredient);
    res.status(201).json(newIngredient);

  } catch (e) {
    console.error("Error creating ingredient:", e);
    res.status(500).json({ error: "Failed to create ingredient." });
  }
};

module.exports = { getIngredients, createIngredients };