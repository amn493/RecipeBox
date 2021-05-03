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

const Comment = mongoose.model('Comment')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe('Testing GET for /comments API', () => {
    // arbitrary recipe for 2nd test
    let recipeID = ''
    before(async () => {
        // dummy users
        await Comment.findOne().then((comment) => {
            if (comment) {
                recipeID = comment.recipe
            }
        })
    })

    // Title of the call in the test
    it('should return 200 OK status', () => {
        // Describe what the test is looking for
        return chai
            .request(app)
            .get('/comments')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.status).to.equal(200)
            })
    })

    it('should return an array given an arbitary recipe ID', () => {
        return chai
            .request(app)
            .get(`/comments?recipeID=${recipeID}`)
            .then((response) => {
                expect(response.body).to.be.an('array')
            })
    })

    it('should return a non-null array of comments given a recipe ID whose respective recipe contains comments', () => {
        return chai
            .request(app)
            .get(`/comments?recipeID=${recipeID}`)
            .then((response) => {
                expect(response.body.length).to.be.greaterThan(0)
                expect(response.body[0]).to.to.have.property('_id')
                expect(response.body[0]).to.to.have.property('recipe')
                expect(response.body[0]).to.to.have.property('user')
                expect(response.body[0]).to.to.have.property('comment')
                expect(response.body[0]).to.to.have.property('createdAt')
            })
    })

    it('should return only comments whose recipeID field is equal to the given recipeID in query string', () => {
        return chai
            .request(app)
            .get(`/comments?recipeID=${recipeID}`)
            .then((response) => {
                response.body.forEach((comment) => {
                    expect(comment.recipe).to.equal(recipeID.toString())
                })
            })
    })
})
