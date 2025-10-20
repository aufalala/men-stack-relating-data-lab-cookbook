const express = require("express")
const router = express.Router()

const { 
    getRecipes, 
    createRecipes,

    getRecipeById,
    deleteRecipeById,
    updateRecipeById,

    getIngredientsOfRecipe,
    addIngredientToRecipe,
} = require("../controllers/recipes.js");

router.get('/', getRecipes);
router.post('/', createRecipes);

router.get('/:recipeId', getRecipeById);
router.delete('/:recipeId', deleteRecipeById);
router.put('/:recipeId', updateRecipeById);


router.get('/:recipeId/ingredients', getIngredientsOfRecipe);
router.post('/:recipeId/ingredients', addIngredientToRecipe);

module.exports = router;