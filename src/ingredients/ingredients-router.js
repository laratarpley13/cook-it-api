const express = require('express');
const IngredientsService = require('./ingredients-service');
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const ingredientsRouter = express.Router();

ingredientsRouter
    .route('/')
    .get((req, res, next) => {
        IngredientsService.getAllIngredients(
            req.app.get('db')
        )
            .then(ingredients => {
                res.json(ingredients)
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
                res.status(201).json(ingredient)
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
    .get((req, res, next) => {
        res.json({
            id: res.ingredient.id,
            recipeid: res.ingredient.recipeid,
            title: res.ingredient.title,
            amount: res.ingredient.amount
        })
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