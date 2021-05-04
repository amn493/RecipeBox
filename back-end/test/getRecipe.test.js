const chai = require('chai')
const chaiHTTP = require('chai-http')
const { response } = require('../app.js')

const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require('../app.js')
const fs = require('fs')

require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')
const Recipe = mongoose.model('Recipe')


describe('Testing route handler for GET /recipe ', () => {
    let slug = ''
    let findRecipe = ''

    before(async () => { 
        await Recipe.findOne({}).then((recipe) => {
            slug = recipe.slug
            findRecipe = recipe
        })
    })

    it('should return 200 OK status for GET /recipe', () => {
        return chai.request(app).get(`/recipe?slug=${slug}`).then((response) => {
            expect(response.status).to.equal(200)
        })
    })

    // To send in /deleterecipe
    let id
    it('should return a recipe object with the correct fields', () => {
        return chai.request(app).get(`/recipe?slug=${slug}`).then((response) => {
            expect(response.body).to.have.property('_id')
            expect(response.body).to.have.property('tags')
            expect(response.body).to.have.property('ingredients')
            expect(response.body).to.have.property('instructions')
            expect(response.body).to.have.property('slug')
            expect(response.body).to.have.property('user')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('imagePath')
            expect(response.body).to.have.property('caption')
            expect(response.body).to.have.property('likes')
            expect(response.body).to.have.property('createdAt')
            expect(response.body).to.have.property('pinned')
        })
    }).timeout(8000)

    it('should return a recipe object with the correct field types', () => {
        return chai.request(app).get(`/recipe?slug=${slug}`).then((response) => {
            expect(response.body).to.have.property('name').that.is.a('string')
            expect(response.body).to.have.property('ingredients').that.is.an('array')
            expect(response.body).to.have.property('imagePath').that.is.a('array')
        })
    }).timeout(8000)

    it ('should return the correct recipe', () => {
        return chai.request(app).get(`/recipe?slug=${slug}`).then((response) => {
            expect(response.body.name).to.equal(findRecipe.name)
            expect(response.body.caption).to.equal(findRecipe.caption)
        })
    })
})