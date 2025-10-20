const express = require("express")
const router = express.Router()

const { getAllUsers, getUsersRecipe} = require("../controllers/users.js");

router.get('/', getAllUsers);
router.get('/:userId/recipes', getUsersRecipe);


module.exports = router;