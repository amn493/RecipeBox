/* eslint-disable */
const chai = require('chai')
const sinon = require('sinon')
const chaiHTTP = require('chai-http')
const expect = chai.expect

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)
require('dotenv').config({ silent: true })

const ObjectId = require('mongodb').ObjectId
const mongoose = require('mongoose')
require('../db.js')

const Comment = mongoose.model('Comment')

// Import our app.js where the route handlers are
const app = require('../app.js')
// Create a mock comment
const mockRecId = '6082ea082ab8214b6c4bad4e'
const mockUserId = '606fb5fb05f0cb9a1c8eb2cb'
let mockComment = {
    recipe: mockRecId,
    user: mockUserId,
    comment:
        'Testing postComment.test.js! If you see this, delete it and fix the unit test.'
}

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe('Testing POST for /comment API', () => {
    // Title of the call in the test
    it('should return 200 OK status', () => {
        return chai
            .request(app)
            .post('/comment')
            .send(mockComment)
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.status).to.equal(200)

                Comment.deleteOne({
                    _id: ObjectId(response.body._id)
                }).then(() => {
                    // If you remove the .then(), the comment doesn't get deleted. Not sure why, but that's why this is here
                })
            })
    })

    it('should return the same comment that was added', () => {
        return chai
            .request(app)
            .post('/comment')
            .send(mockComment)
            .then((response) => {
                expect(response.body).to.contain.keys(
                    'recipe',
                    'user',
                    'comment',
                    'createdAt'
                )

                expect(response.body.recipe).to.equal(mockRecId)
                expect(response.body.user).to.equal(mockUserId)
                expect(response.body.comment).to.equal(mockComment.comment)
                Comment.deleteOne({
                    _id: ObjectId(response.body._id)
                }).then(() => {
                    // If you remove the .then(), the comment doesn't get deleted. Not sure why, but that's why this is here
                })
            })
    })
})
