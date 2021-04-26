const express = require('express');
const CategoriesService = require('./categories-service');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();

const categoriesRouter = express.Router();

categoriesRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        CategoriesService.getAllCategories(
            req.app.get('db')
        )
            .then(categories => {
                res.json(categories)
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { title } = req.body;
        const newCategory = { title };

        if (!title) {
            return res.status(400).json({
                error: { message: `Missing 'title' in request body` }
            })
        }

        CategoriesService.insertCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res.status(201).json(category)
            })
            .catch(next)
    })

categoriesRouter
    .route('/:id')
    .all(requireAuth, (req, res, next) => {
        CategoriesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(category => {
                if(!category) {
                    return res.status(404).json({
                        error: { message: `Category doesn't exist` }
                    })
                }
                res.category = category
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.category.id,
            title: res.category.title
        })
    })
    .delete((req, res, next) => {
        CategoriesService.deleteCategory(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
    })

module.exports = categoriesRouter;