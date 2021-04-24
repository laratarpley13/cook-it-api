const express = require('express');
const IngredientsService = require('./ingredients-service');
const xss = require('xss')
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const ingredientsRouter = express.Router();

serializeIngredient = (ingredient) => {
    return {
        id: ingredient.id,
        recipeid: ingredient.recipeid,
        title: xss(ingredient.title),
        amount: xss(ingredient.amount)
    }
}

ingredientsRouter
    .route('/')
    .get((req, res, next) => {
        IngredientsService.getAllIngredients(
            req.app.get('db')
        )
            .then(ingredients => {
                res.json(ingredients.map(ingredient => serializeIngredient(ingredient)))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { recipeid, title, amount } = req.body;
        const newIngredient = { recipeid, title, amount };

        for (const [key, value] of Object.entries(newIngredient)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        IngredientsService.insertIngredient(
            req.app.get('db'),
            newIngredient
        )
            .then(ingredient => {
                res.status(201).json(serializeIngredient(ingredient))
            })
            .catch(next)
    })

ingredientsRouter
    .route('/:recipeid')
    .get((req, res, next) => {
        IngredientsService.getIngredientsByRecipe(
            req.app.get('db'),
            req.params.recipeid
        )
            .then(ingredients => {
                if(ingredients.length === 0) {
                    return res.status(404).json({
                        error: { message: `no ingredients exist for this recipe` }
                    })
                }
                res.json(ingredients.map(ingredient => serializeIngredient(ingredient)))
            })
            .catch(next)
    })

ingredientsRouter
    .route('/:id')
    .all((req, res, next) => {
        IngredientsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(ingredient => {
                if(!ingredient) {
                    return res.status(404).json({
                        error: { message: `ingredient doesn't exist` }
                    })
                }
                res.ingredient = ingredient
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        IngredientsService.deleteIngredient(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
    })

module.exports = ingredientsRouter;