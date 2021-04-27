const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeTagsArray } = require('./tags.fixtures')

describe('Tags Endpoints', function() {
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

    context(`Given there are lists in the database`, () => {
        const testTags = makeTagsArray();
        const testUsers = makeUsersArray();
        
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })
        beforeEach('insert tags', () => {
            return db
                .into('tags')
                .insert(testTags)
        })
        
        it('GET /api/tags responds with 200 and all of the categories', () => {
            return supertest(app)
                .get('/api/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, testTags)
        })
        it('DELETE /api/tags/:id responds with 204 if tag exists and is succesful', () => {
            return supertest(app)
                .delete(`/api/tags/2`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204)
        })
        it('DELETE /api/tags/:id responds with 404 status if tag does not exist', () => {
            return supertest(app)
                .delete(`/api/tags/3`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404, {error: {message: `tag doesn't exist`}})
        })
    })

    context(`Given there are no categories in the database`, () => {
        const testUsers = makeUsersArray();
        
        beforeEach('insert users', () => {
            return db
                .into('users')
                .insert(testUsers)
        })

        it('GET /api/tags responds with an empty array', () => {
            return supertest(app)
                .get('/api/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200, [])
        })
    })

    context(`makes a POST request to api/tags`, () => {
        it('returns a 201 and the tag when title is provided', () => {
            return supertest(app)
                .post('/api/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: "Vegetarian",
                })
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql("Vegetarian")
                })
        })
        it('returns a 400 status when title is not provided', () => {
            return supertest(app)
                .post('/api/tags')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400, {
                    error: { message: `Missing 'title' in request body` }
                })
        })
    })
})