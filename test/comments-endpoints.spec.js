const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeRecipesArray } = require('./recipes.fixtures')
const { makeCategoriesArray } = require('./categories.fixtures')
const { makeCommentsArray } = require('./comments.fixtures')

describe('Comments Endpoints', function() {
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

    context(`Given there are comments in the database`, () => {
        const testRecipes = makeRecipesArray();
        const testUsers = makeUsersArray();
        const testCategories = makeCategoriesArray();
        const testComments = makeCommentsArray();
        
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
        beforeEach('insert comments', () => {
            return db
                .into('comments')
                .insert(testComments)
        })
        
        it('GET /api/comments responds with 200 and all of the comments', () => {
            return supertest(app)
                .get('/api/comments')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, testComments)
        })
        it('GET /api/comments/:recipeid responds with 200 and all of the comments', () => {
            return supertest(app)
                .get('/api/comments/1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
        it('GET /api/comments/byuser/:userid responds with 200 and all of the comments', () => {
            return supertest(app)
                .get('/api/comments/byuser/1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
        })
        it('DELETE /api/comments/:id responds with 204 if recipe exists and is succesful', () => {
            return supertest(app)
                .delete(`/api/comments/2`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)
        })
        it('DELETE /api/comments/:id responds with 404 status if comment does not exist', () => {
            return supertest(app)
                .delete(`/api/comments/7`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404, {error: {message: `comment doesn't exist`}})
        })
    })

    context(`Given there are no comments in the database`, () => {
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

        it('GET /api/comments responds with an empty array', () => {
            return supertest(app)
                .get('/api/comments')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, [])
        })
    })

    context(`makes a POST request to /api/comments`, () => {
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
                .post('/api/comments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    recipeid: 1,
                    userid: 1,
                    comment: "Test Comment",
                    imgurl: "www.test.com"
                })
                .expect(201)
        })
    })
})