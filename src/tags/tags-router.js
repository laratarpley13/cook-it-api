const express = require('express');
const TagsService = require('./tags-service');
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const tagsRouter = express.Router();

tagsRouter
    .route('/')
    .get((req, res, next) => {
        TagsService.getAllTags(
            req.app.get('db')
        )
            .then(tags => {
                res.json(tags)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title } = req.body;
        const newTag = { title };

        if (!title) {
            return res.status(400).json({
                error: { message: `Missing 'title' in request body` }
            })
        }

        TagsService.insertTag(
            req.app.get('db'),
            newTag
        )
            .then(tag => {
                res.status(201).json(tag)
            })
            .catch(next)
    })

tagsRouter
    .route('/:id')
    .all((req, res, next) => {
        TagsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(tag => {
                if(!tag) {
                    return res.status(404).json({
                        error: { message: `tag doesn't exist` }
                    })
                }
                res.tag = tag
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.tag.id,
            title: res.tag.title
        })
    })
    .delete((req, res, next) => {
        TagsService.deleteTag(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
    })

module.exports = tagsRouter;