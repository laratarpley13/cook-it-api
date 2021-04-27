const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeRecipesArray } = require('./recipes.fixtures')
const { makeCategoriesArray } = require('./categories.fixtures')
const { makeIngredientsArray } = require('./ingredients.fixtures')

describe('Ingredients Endpoints', function() {
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

    context(`Given there are ingredients in the database`, () => {
        const testRecipes = makeRecipesArray();
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testIngredients = makeIngredientsArray();
        
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
        beforeEach('insert ingredients', () => {
            return db
                .into('ingredients')
                .insert(testIngredients)
        })
        
        it('GET /api/ingredients responds with 200 and all of the ingredients', () => {
            return supertest(app)
                .get('/api/ingredients')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, testIngredients)
        })
        it('GET /api/ingredients responds with 200 and all of the ingredients', () => {
            return supertest(app)
                .get('/api/ingredients/1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
        it('DELETE /api/recipes/:id responds with 204 if recipe exists and is succesful', () => {
            return supertest(app)
                .delete(`/api/ingredients/2`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)
        })
        it('DELETE /api/ingredients/:id responds with 404 status if ingredient does not exist', () => {
            return supertest(app)
                .delete(`/api/ingredients/7`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404, {error: {message: `ingredient doesn't exist`}})
        })
    })

    context(`Given there are no ingredients in the database`, () => {
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

        it('GET /api/ingredients responds with an empty array', () => {
            return supertest(app)
                .get('/api/ingredients')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, [])
        })
    })

    context(`makes a POST request to /api/ingredients`, () => {
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
                .post('/api/ingredients')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipeid: 1,
                    title: "Test Ing",
                    amount: "Two pinches"
                })
                .expect(201)
        })
    })
})