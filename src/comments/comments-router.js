const express = require('express');
const xss = require('xss');
const CommentsService = require('./comments-service');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();

const commentsRouter = express.Router();

const serializeComment = (comment) => {
    return {
        id: comment.id,
        recipeid: comment.recipeid,
        userid: comment.userid,
        comment: xss(comment.comment),
        imgurl: xss(comment.imgurl)
    }
}

commentsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        CommentsService.getAllComments(
            req.app.get('db')
        )
            .then(comments => {
                res.json(comments.map(comment => serializeComment(comment)))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { recipeid, userid, imgurl, comment } = req.body;
        const newComment = { recipeid, userid, imgurl, comment };

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
                res.status(201).json(serializeComment(comment))
            })
            .catch(next)
    })

commentsRouter
    .route('/:recipeid')
    .get(requireAuth, (req, res, next) => {
        CommentsService.getCommentsByRecipe(
            req.app.get('db'),
            req.params.recipeid
        )
            .then(comments => {
                if(comments.length === 0) {
                    return res.send([])
                }
                res.json(comments.map(comment => serializeComment(comment)))
            })
            .catch(next)
    })

commentsRouter
    .route('/byuser/:userid')
    .get(requireAuth, (req, res, next) => {
        CommentsService.getCommentsByUser(
            req.app.get('db'),
            req.params.userid
        )
            .then(comments => {
                if(comments.length === 0) {
                    return res.send([])
                }
                res.json(comments.map(comment => serializeComment(comment)))
            })
            .catch(next)
    })

commentsRouter
    .route('/:id')
    .all(requireAuth, (req, res, next) => {
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