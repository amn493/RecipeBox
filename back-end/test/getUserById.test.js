/* eslint-disable */
const chai = require('chai')
const chaiHTTP = require('chai-http')
const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

const mongoose = require('mongoose')
require('../db.js')

const User = mongoose.model('User')

// Import our app.js where the route handlers are
const app = require('../app.js')

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe('Testing GET for /userbyid API', () => {
    // Pull in a "random" user
    let userID = ''
    let userObj = {}
    before(async () => {
        await User.findOne({}).then((user) => {
            userID = user._id
            userObj = user
        })
    })
    it('should return 200 OK status', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/userbyid')
            .send({
                _id: userID
            })
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.status).to.equal(200)
            }))

    it('should return a user object given user id', () =>
        chai
            .request(app)
            .get(`/userbyid?id=${userID}`)
            .then((response) => {
                expect(response.body.slug).to.be.a('string')
                expect(response.body.followers).to.be.an('array')
            }))

    it('should return the same user object that was found', () => {
        return chai
            .request(app)
            .get(`/userbyid?id=${userID}`)
            .then((response) => {
                expect(JSON.stringify(response.body)).to.equal(
                    JSON.stringify(userObj)
                )
            })
    }).timeout(8000)
})
