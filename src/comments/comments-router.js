const express = require('express');
const CommentsService = require('./comments-service');
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const commentsRouter = express.Router();

commentsRouter
    .route('/')
    .get((req, res, next) => {
        CommentsService.getAllComments(
            req.app.get('db')
        )
            .then(comments => {
                res.json(comments)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { recipeid, title, amount } = req.body;
        const newComment = { recipeid, title, amount };

        for (const [key, value] of Object.entries(newComment)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        CommentsService.insertComment(
            req.app.get('db'),
            newComment
        )
            .then(comment => {
                res.status(201).json(comment)
            })
            .catch(next)
    })

commentsRouter
    .route('/:recipeid')
    .get((req, res, next) => {
        CommentsService.getCommentsByRecipe(
            req.app.get('db'),
            req.params.recipeid
        )
            .then(comments => {
                if(comments.length === 0) {
                    return res.status(404).json({
                        error: { message: `no comments exist for this recipe` }
                    })
                }
                res.json(comments)
            })
            .catch(next)
    })

commentsRouter
    .route('/byuser/:userid')
    .get((req, res, next) => {
        CommentsService.getCommentsByUser(
            req.app.get('db'),
            req.params.userid
        )
            .then(comments => {
                if(comments.length === 0) {
                    return res.status(404).json({
                        error: { message: `No comments exist for this user` }
                    })
                }
                res.json(comments)
            })
            .catch(next)
    })

commentsRouter
    .route('/:id')
    .all((req, res, next) => {
        CommentsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(comment => {
                if(!comment) {
                    return res.status(404).json({
                        error: { message: `comment doesn't exist` }
                    })
                }
                res.comment = comment
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        CommentsService.deleteComment(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
    })

module.exports = commentsRouter;