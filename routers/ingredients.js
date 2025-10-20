const express = require("express")
const router = express.Router()

const { getIngredients, createIngredients } = require("../controllers/ingredients.js");

router.get('/', getIngredients);
router.post('/', createIngredients);

module.exports = router;