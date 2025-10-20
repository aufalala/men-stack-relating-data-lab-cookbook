const mongoose = require('mongoose');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

const getRecipes = async (req, res) => {
  const userId = req.decoded._id;

  try {
    const recipes = await Recipe.find({ owner: userId })
      .populate('owner', 'username')
      .populate('ingredients', 'name');

    res.json({
      _id: userId,
      recipes: recipes,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ err: e.message });
  }
};

const createRecipes = async (req, res) => {
  const recipe = {
    name: req.body.name,
    instructions: req.body.instructions,
    owner: req.decoded._id,
    ingredients: req.body.ingredients,
  }

  try {
    const newRecipe = await Recipe.create(recipe);
    res.status(201).json(newRecipe);

  } catch (e) {
    console.error("Error creating recipe:", e);
    res.status(500).json({ error: "Failed to create recipe." });
  }
};

const getRecipeById = async (req, res) => {
  const recipeId = req.params.recipeId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }
 
  try {
    const recipe = await Recipe.findOne({ _id: recipeId })
      .populate('owner', 'username')
      .populate('ingredients', 'name');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
  
    res.status(200).json(recipe);

  } catch (e) {
    console.error("Error fetching recipe:", e);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteRecipeById = async (req, res) => {
  const userId = req.decoded._id;
  
  const recipeId = req.params.recipeId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }

  try {
    const recipe = await Recipe.deleteOne({ _id: recipeId, owner: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
  
    res.status(200).json({ message: 'Recipe deleted successfully'});

  } catch (e) {
    console.error("Error deleting recipe:", e);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRecipeById = async (req, res) => {
  const userId = req.decoded._id;

  const recipeId = req.params.recipeId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }
 
  try {
    const recipe = await Recipe.findOne({ _id: recipeId, owner: userId });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
    
    recipe.set(req.body);
    await recipe.save();

    res.status(200).json({ message: 'Recipe updated successfully', recipe });

  } catch (e) {
    console.error("Error deleting recipe:", e);
    res.status(500).json({ error: 'Server error' });
  }
};


const getIngredientsOfRecipe = async (req, res) => {
  const userId = req.decoded._id;

  const recipeId = req.params.recipeId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }
 
  try {
    const recipe = await Recipe.findOne({ _id: recipeId, owner: userId }).populate('ingredients', 'name');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
  
    res.status(200).json(recipe.ingredients);

  } catch (e) {
    console.error("Error fetching recipe:", e);
    res.status(500).json({ error: 'Server error' });
  }
};

const addIngredientToRecipe = async (req, res) => {
  const userId = req.decoded._id;

  const recipeId = req.params.recipeId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }

  const ingredientToAdd = req.body;

  let recipe;
  let ingredient;
 
  try {
    recipe = await Recipe.findOne({ _id: recipeId, owner: userId }).populate('ingredients', 'name');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
    
  } catch (e) {
    console.error("Error fetching recipe:", e);
    return res.status(500).json({ error: 'Server error' });
  }

  try {
    ingredient = await Ingredient.findOne({ name: ingredientToAdd.ingredient });

    if (!ingredient) {
      try {
        const newIngredient = await Ingredient.create({ name: ingredientToAdd.ingredient });
        console.log("New Ingredient Added");
        ingredient = newIngredient;

      } catch (e) {
        console.error("Error creating ingredient:", e);
        return res.status(500).json({ error: "Failed to create ingredient." });
      }
    }
    
  } catch (e) {
    console.error("Error fetching ingredient:", e);
    return res.status(500).json({ error: 'Server error' });
  }

  if (recipe.ingredients.some(i => i._id.equals(ingredient._id))) {
    return res.status(400).json({ error: 'Ingredient already added to recipe' });
  }
  
  recipe.ingredients.push(ingredient._id);
  await recipe.save();
  await recipe.populate([
    { path: 'ingredients', select: 'name' },
    { path: 'owner', select: 'username' }
  ]);

  res.status(200).json({message: 'Ingredient added successfully', recipe });

};



module.exports = { getRecipes, createRecipes, getRecipeById, deleteRecipeById, updateRecipeById, getIngredientsOfRecipe, addIngredientToRecipe,};