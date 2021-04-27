const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeRecipesArray } = require('./recipes.fixtures')
const { makeCategoriesArray } = require('./categories.fixtures')
const { makeTagsArray } = require('./tags.fixtures')
const { makeRecipeTagsArray } = require('./recipe-tags.fixtures')

describe('RecipeTags Endpoints', function() {
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

    context(`Given there are recipeTags in the database`, () => {
        const testRecipes = makeRecipesArray();
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testTags = makeTagsArray();
        const testRecipeTags = makeRecipeTagsArray();
        
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
        beforeEach('insert tags', () => {
            return db
                .into('tags')
                .insert(testTags)
        })
        beforeEach('insert recipes', () => {
            return db
                .into('recipes')
                .insert(testRecipes)
        })
        beforeEach('insert recipeTags', () => {
            return db
                .into('recipetags')
                .insert(testRecipeTags)
        })
        
        it('GET /api/recipetags responds with 200 and all of the recipetags', () => {
            return supertest(app)
                .get('/api/recipetags')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, testRecipeTags)
        })
        it('GET /api/recipetags/:recipeid responds with 200 and all of the comments', () => {
            return supertest(app)
                .get('/api/recipetags/1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
    })

    context(`Given there are no recipeTags in the database`, () => {
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testTags = makeTagsArray();
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
        beforeEach('insert tags', () => {
            return db
                .into('tags')
                .insert(testTags)
        })
        beforeEach('insert recipes', () => {
            return db
                .into('recipes')
                .insert(testRecipes)
        })

        it('GET /api/recipetags responds with an empty array', () => {
            return supertest(app)
                .get('/api/recipetags')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, [])
        })
    })

    context(`makes a POST request to /api/recipetags`, () => {
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testTags = makeTagsArray();
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
        beforeEach('insert tags', () => {
            return db
                .into('tags')
                .insert(testTags)
        })
        beforeEach('insert recipes', () => {
            return db
                .into('recipes')
                .insert(testRecipes)
        })

        it('returns a 201 and the recipe when all info is provided', () => {
            return supertest(app)
                .post('/api/recipetags')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipeid: 1,
                    tagid: 1
                })
                .expect(201)
        })
    })
})