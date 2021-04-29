/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const Recipe = mongoose.model('Recipe')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe('Testing route handler for GET /filteredrecipes ', () => {
    // for testing whether all recipe documents are returned
    // with empty filter
    let recipeCount = 0
    before(async () => {
        // count of all recipes in Recipe collection
        await Recipe.countDocuments({}).then((count) => {
            recipeCount = count
        })
    })

    // Title of the call in the test
    it('should return 200 OK status', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/filteredrecipes?keyword=&tags=')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.status).to.equal(200)
            }))

    it('should return all recipes when filter is empty', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/filteredrecipes?keyword=&tags=')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.body.length).to.equal(recipeCount)
            }))

    it('elements of the response array should be recipe objects', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/filteredrecipes?keyword=&tags=')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.body[0])
                    .to.have.property('user')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('name')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('imagePath')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('tags')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('caption')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('ingredients')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('instructions')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('likes')
                    .that.is.a('number')
                expect(response.body[0])
                    .to.have.property('createdAt')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('slug')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('_id')
                    .that.is.a('string')
            }))
})
