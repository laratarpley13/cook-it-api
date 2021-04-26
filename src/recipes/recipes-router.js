const express = require('express');
const RecipesService = require('./recipes-service');
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();

const recipesRouter = express.Router();

const serializeRecipe = (recipe) => {
    return {
        id: recipe.id,
        userid: recipe.userid,
        categoryid: recipe.categoryid,
        title: xss(recipe.title),
        description: xss(recipe.description),
        imgurl: xss(recipe.imgurl),
        date_created: recipe.date_created
    }
}

recipesRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        RecipesService.getAllRecipes(
            req.app.get('db')
        )
            .then(recipes => {
                res.json(recipes.map(recipe => serializeRecipe(recipe)))
            })
            .catch(next)
    })
    .post(requireAuth ,jsonParser, (req, res, next) => {
        const { userid, categoryid, title, description, imgurl } = req.body;
        const newRecipe = { userid, categoryid, title, description, imgurl };

        for (const [key, value] of Object.entries(newRecipe)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        RecipesService.insertRecipe(
            req.app.get('db'),
            newRecipe
        )
            .then(recipe => {
                res.status(201).json(serializeRecipe(recipe))
            })
            .catch(next)
    })

recipesRouter
    .route('/bycategory/:categoryid')
    .get(requireAuth, (req, res, next) => {
        RecipesService.getRecipesByCategory(
            req.app.get('db'),
            req.params.categoryid
        )
            .then(recipes => {
                if(recipes.length === 0) {
                    return res.status(404).json({
                        error: { message: `no recipes exist for this category` }
                    })
                }
                res.json(recipes.map(recipe => serializeRecipe(recipe)))
            })
            .catch(next)
    })

recipesRouter
    .route('/byuser/:userid')
    .get(requireAuth, (req, res, next) => {
        RecipesService.getRecipesByUser(
            req.app.get('db'),
            req.params.userid
        )
            .then(recipes => {
                if(recipes.length === 0) {
                    return res.status(404).json({
                        error: { message: `No recipes exist for this user` }
                    })
                }
                res.json(recipes.map(recipe => serializeRecipe(recipe)))
            })
            .catch(next)
    })

recipesRouter
    .route('/:id')
    .all(requireAuth, (req, res, next) => {
        RecipesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(recipe => {
                if(!recipe) {
                    return res.status(404).json({
                        error: { message: `Recipe doesn't exist` }
                    })
                }
                res.recipe = recipe
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.recipe.id,
            userid: res.recipe.userid,
            categoryid: res.recipe.categoryid,
            title: xss(res.recipe.title),
            description: xss(res.recipe.description),
            imgurl: xss(res.recipe.imgurl),
            date_created: res.recipe.date_created,
        })
    })
    .delete((req, res, next) => {
        RecipesService.deleteRecipe(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
    })

module.exports = recipesRouter;