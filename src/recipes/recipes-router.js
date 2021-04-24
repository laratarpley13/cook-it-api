const express = require('express');
const RecipesService = require('./recipes-service');
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const recipesRouter = express.Router();

recipesRouter
    .route('/')
    .get((req, res, next) => {
        RecipesService.getAllRecipes(
            req.app.get('db')
        )
            .then(recipes => {
                res.json(recipes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
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
                res.status(201).json(recipe)
            })
            .catch(next)
    })

recipesRouter
    .route('/bycategory/:categoryid')
    .get((req, res, next) => {
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
                res.json(recipes)
            })
            .catch(next)
    })

recipesRouter
    .route('/byuser/:userid')
    .get((req, res, next) => {
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
                res.json(recipes)
            })
            .catch(next)
    })

recipesRouter
    .route('/:id')
    .all((req, res, next) => {
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
            title: res.recipe.title,
            description: res.recipe.description,
            imgurl: res.recipe.imgurl,
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