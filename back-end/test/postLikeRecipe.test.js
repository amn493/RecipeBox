/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const User = mongoose.model('User')
const Recipe = mongoose.model('Recipe')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing POST to /likerecipe API (like)', () => {
    let recipeID = ''
    let userID = ''
    let likes
    beforeEach(async () => {
        await Recipe.findOne({}).then((recipe) => {
            if (recipe) {
                recipeID = recipe._id
                likes = recipe.likes
            }
        })
        await User.findOne({ liked: { $nin: recipeID } }).then((user) => {
            if (user) {
                userID = user._id
            }
        })
    })
    afterEach(async () => {
        console.log('\x1b[2m', '...unlike test...')
        chai.request(app).post('/likerecipe').send({
            like: false,
            recipeID: recipeID,
            userID: userID
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: true,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))
    it('should return user with correct field names', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: true,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                // eslint-disable-next-line no-unused-expressions
                expect(response.body.user)
                    .to.have.property('liked')
                    .that.is.an('array').that.is.not.empty
            }))
    it('should return user with correct field data', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: true,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                expect(response.body.user.liked).to.include(recipeID.toString())
            }))
    it('should return recipe with correct field names', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: true,
                userID: userID,
                recipeID: recipeID
            })
            .then((response) => {
                expect(response.body.recipe).to.have.property('likes')
            }))
    it('should return recipe with correct field data', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: true,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                expect(response.body.recipe.likes).to.equal(likes + 1)
            }))
})

describe('Testing POST to /likerecipe API (unlike)', () => {
    let recipeID = ''
    let userID = ''
    let likes
    beforeEach(async () => {
        await Recipe.findOne({}).then((recipe) => {
            if (recipe) {
                recipeID = recipe._id
                likes = recipe.likes
            }
        })
        await User.findOne({ liked: { $in: recipeID } }).then((user) => {
            if (user) {
                userID = user._id
            }
        })
    })
    afterEach(async () => {
        console.log('\x1b[2m', '...like test...')
        chai.request(app).post('/likerecipe').send({
            like: true,
            recipeID: recipeID,
            userID: userID
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: false,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))
    it('should return user with correct field names', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: false,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                // eslint-disable-next-line no-unused-expressions
                expect(response.body.user)
                    .to.have.property('liked')
                    .that.is.an('array').that.is.not.empty
            }))
    it('should return user with correct field data', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: false,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                expect(response.body.user.liked).to.not.include(
                    recipeID.toString
                )
            }))
    it('should return recipe with correct field names', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: false,
                userID: userID,
                recipeID: recipeID
            })
            .then((response) => {
                expect(response.body.recipe).to.have.property('likes')
            }))
    it('should return recipe with correct field data', () =>
        chai
            .request(app)
            .post('/likerecipe')
            .send({
                like: false,
                recipeID: recipeID,
                userID: userID
            })
            .then((response) => {
                expect(response.body.recipe.likes).to.equal(likes - 1)
            }))
})
