require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const recipesRouter = require('./recipes/recipes-router')
const categoriesRouter = require('./categories/categories-router')
const tagsRouter = require('./tags/tags-router')
const ingredientsRouter = require('./ingredients/ingredients-router')
const stepsRouter = require('./steps/steps-router')
const commentsRouter = require('./comments/comments-router')
const recipeTagsRouter = require('./recipe-tags/recipe-tags-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/recipes', recipesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/ingredients', ingredientsRouter)
app.use('/api/steps', stepsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/recipetags', recipeTagsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app