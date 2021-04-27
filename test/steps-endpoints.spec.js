const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeRecipesArray } = require('./recipes.fixtures')
const { makeCategoriesArray } = require('./categories.fixtures')
const { makeStepsArray } = require('./steps.fixtures')

describe('Steps Endpoints', function() {
    let db;
    let authToken;

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    beforeEach('clean the table', () => 
        db.raw(
            "TRUNCATE TABLE users, categories, tags, recipes, ingredients, steps, comments, recipetags RESTART IDENTITY CASCADE"
        )
    )

    beforeEach('register and login', () => {
        let user = { email: "test@test.com", password: "P@ssword1234", nickname: "Demo" }
        return supertest(app)
            .post('/api/users')
            .send(user)
            .then(res => {
                return supertest(app).post('/api/auth/signin').send(user).then(res2 =>
                    authToken = res2.body.authToken    
                )
            })
    })

    after('disconnect from db', () => db.destroy())

    context(`Given there are steps in the database`, () => {
        const testRecipes = makeRecipesArray();
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testSteps = makeStepsArray();
        
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })
        beforeEach('insert categories', () => {
            return db
                .into('categories')
                .insert(testCategories)
        })
        beforeEach('insert recipes', () => {
            return db
                .into('recipes')
                .insert(testRecipes)
        })
        beforeEach('insert steps', () => {
            return db
                .into('steps')
                .insert(testSteps)
        })
        
        it('GET /api/steps responds with 200 and all of the steps', () => {
            return supertest(app)
                .get('/api/steps')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, testSteps)
        })
        it('GET /api/steps/:recipeid responds with 200 and all of the steps', () => {
            return supertest(app)
                .get('/api/steps/')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
        it('DELETE /api/steps/bysteps/:id responds with 204 if recipe exists and is succesful', () => {
            return supertest(app)
                .delete(`/api/steps/bystep/2`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)
        })
        it('DELETE /api/steps/bystep/:id responds with 404 status if steps does not exist', () => {
            return supertest(app)
                .delete(`/api/steps/bystep/7`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404, {error: {message: `step doesn't exist`}})
        })
    })

    context(`Given there are no steps in the database`, () => {
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testRecipes = makeRecipesArray();
        
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })
        beforeEach('insert categories', () => {
            return db
                .into('categories')
                .insert(testCategories)
        })
        beforeEach('insert recipes', () => {
            return db
                .into('recipes')
                .insert(testRecipes)
        })

        it('GET /api/steps responds with an empty array', () => {
            return supertest(app)
                .get('/api/steps')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, [])
        })
    })

    context(`makes a POST request to /api/steps`, () => {
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testRecipes = makeRecipesArray();

        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })
        beforeEach('insert categories', () => {
            return db
                .into('categories')
                .insert(testCategories)
        })
        beforeEach('insert recipes', () => {
            return db
                .into('recipes')
                .insert(testRecipes)
        })

        it('returns a 201 and the recipe when all info is provided', () => {
            return supertest(app)
                .post('/api/steps')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipeid: 1,
                    text: "Test Step"
                })
                .expect(201)
        })
    })
})