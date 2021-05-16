/* eslint-disable no-undef */
const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai

chai.use(chaiHTTP)

// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')
const mongoose = require('mongoose')

const app = require('../app.js')

const Recipe = mongoose.model('Recipe')
require('../db.js')

// Using ash's user id "606e7b0b199a830c8552dac2"
// UPDATE TEST IF USER NO LONGER EXISTS

describe('Testing GET for /recipesbyuser API', () => {
    let userID = ''
    before(async () => {
        // dummy user
        await Recipe.findOne({}).then((recipe) => {
            if (recipe) {
                // eslint-disable-next-line no-underscore-dangle
                userID = recipe.user
            }
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .get('/recipesbyuser')
            .then((response) => {
                expect(response.status).to.equal(200)
            })).timeout(3000)

    it('should return at least one recipe objects', () =>
        chai
            .request(app)
            .get('/recipesbyuser')
            .query({ userID: userID.toString() })
            .then((response) => {
                // Check that first recipe has content
                expect(response.body[0])
                    .to.have.property('name')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('ingredients')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('instructions')
                    .that.is.an('array')
            })).timeout(4000)
})
