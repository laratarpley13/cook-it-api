const express = require('express');
const RecipesService = require('../recipes/recipes-service');
const RecipeTagsService = require('./recipe-tags-service');
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const recipeTagsRouter = express.Router();

recipeTagsRouter
    .route('/')
    .get((req, res, next) => {
        RecipeTagsService.getAllRecipeTags(
            req.app.get('db')
        )
            .then(ingredients => {
                res.json(ingredients)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { recipeid, title, amount } = req.body;
        const newRecipeTag = { recipeid, title, amount };

        for (const [key, value] of Object.entries(newRecipeTag)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        RecipeTagsService.insertRecipeTag(
            req.app.get('db'),
            newRecipeTag
        )
            .then(ingredient => {
                res.status(201).json(ingredient)
            })
            .catch(next)
    })

recipeTagsRouter
    .route('/:recipeid')
    .get((req, res, next) => {
        RecipeTagsService.getRecipeTagsByRecipe(
            req.app.get('db'),
            req.params.recipeid
        )
            .then(recipeTags => {
                if(recipeTags.length === 0) {
                    return res.status(404).json({
                        error: { message: `no recipeTags exist for this recipe` }
                    })
                }
                res.json(recipeTags)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        RecipeTagsService.deleteRecipeTagsByRecipe(
            req.app.get('db'),
            req.params.recipeid
        )
            .then(() => {
                res.status.end()
            })
            .catch(next)
    })

module.exports = recipeTagsRouter;