const express = require('express');
const StepsService = require('./steps-service');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
//const {requireAuth} = require('../middleware/jwt-auth');
const jsonParser = express.json();

const stepsRouter = express.Router();

const serializeStep = (step) => {
    return {
        id: step.id,
        recipeid: step.recipeid,
        text: xss(step.text)
    }
}

stepsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        StepsService.getAllSteps(
            req.app.get('db')
        )
            .then(steps => {
                res.json(steps.map(step => serializeStep(step)))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { recipeid, text } = req.body;
        const newStep = { recipeid, text };

        for (const [key, value] of Object.entries(newStep)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        StepsService.insertStep(
            req.app.get('db'),
            newStep
        )
            .then(step => {
                res.status(201).json(serializeStep(step))
            })
            .catch(next)
    })

stepsRouter
    .route('/:recipeid')
    .get(requireAuth, (req, res, next) => {
        StepsService.getStepsByRecipe(
            req.app.get('db'),
            req.params.recipeid
        )
            .then(steps => {
                if(steps.length === 0) {
                    return res.status(404).json({
                        error: { message: `no steps exist for this recipe` }
                    })
                }
                res.json(steps.map(step => serializeStep(step)))
            })
            .catch(next)
    })

stepsRouter
    .route('/bystep/:id')
    .all(requireAuth, (req, res, next) => {
        StepsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(step => {
                if(!step) {
                    return res.status(404).json({
                        error: { message: `step doesn't exist` }
                    })
                }
                res.step = step
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        StepsService.deleteStep(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
    })

module.exports = stepsRouter;