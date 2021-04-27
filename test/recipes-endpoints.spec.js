const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeRecipesArray } = require('./recipes.fixtures')
const { makeCategoriesArray } = require('./categories.fixtures')

describe('Recipes Endpoints', function() {
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

    context(`Given there are recipes in the database`, () => {
        const testRecipes = makeRecipesArray();
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        
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
        
        it('GET /api/recipes responds with 200 and all of the recipes', () => {
            return supertest(app)
                .get('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, testRecipes)
        })
        it('GET /api/recipes/bycategory/:categoryid responds with 200 and all of the recipes', () => {
            return supertest(app)
                .get('/api/recipes/bycategory/1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
        it('GET /api/recipes/byuser/:userid responds with 200 and all of the recipes', () => {
            return supertest(app)
                .get('/api/recipes/byuser/1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
        it('DELETE /api/recipes/:id responds with 204 if recipe exists and is succesful', () => {
            return supertest(app)
                .delete(`/api/recipes/2`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)
        })
        it('DELETE /api/recipes/:id responds with 404 status if tag does not exist', () => {
            return supertest(app)
                .delete(`/api/recipes/5`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404, {error: {message: `Recipe doesn't exist`}})
        })
    })

    context(`Given there are no recipes in the database`, () => {
        const testUsers = makeUsersArray();
        
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })

        it('GET /api/recipes responds with an empty array', () => {
            return supertest(app)
                .get('/api/recipes')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, [])
        })
    })

    context(`makes a POST request to api/recipes`, () => {
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();

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

        it('returns a 201 and the recipe when all info is provided', () => {
            return supertest(app)
                .post('/api/recipes/')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    userid: 1,
                    categoryid: 1,
                    title: "Test",
                    description: "Test",
                    imgurl: "www.test.com"
                })
                .expect(201)
        })
    })
})