/* eslint-disable */
// Test expected output when given valid input
// Test expected output when given invalid input

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

// For chai to run tests on an unused port
chai.use(chaiHTTP)
require('dotenv').config({ silent: true })

const mongoose = require('mongoose')
require('../db.js')

const User = mongoose.model('User')

const app = require('../app.js')

// If Mockaroo is down, change route to "res.send('Text')" and
// comment out the axios to make sure the test runs.

// Group of tests
describe('Testing route handler for GET /usersbyname ', () => {
    // get 3 users "randomly"
    let pulledUser = {}
    before(async () => {
        await User.findOne({}).then((user) => {
            pulledUser = user
        })
    })

    it('should return 200 OK status ', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.username}`)
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    }).timeout(3000)

    // The following tests simply search for the found user's firstName, lastName, then username
    it('should return a user object whose firstName matches that which was pulled from database', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.firstName}`)
            .then((response) => {
                // list should be of at least size one, so check the first item
                expect(response.body[0].firstName).to.equal(
                    pulledUser.firstName
                )
            })
    })

    it('should return a user object whose lastName matches that which was pulled from database', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.firstName}`)
            .then((response) => {
                // list should be of at least size one, so check the first item
                expect(response.body[0].lastName).to.equal(pulledUser.lastName)
            })
    })

    it('should return a user object whose username matches that which was pulled from database', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.username}`)
            .then((response) => {
                // list should be of at least size one, so check the first item
                expect(response.body[0].username).to.equal(pulledUser.username)
            })
    })

    it('should return an array where each item has at least one valid field', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.username}`)
            .then((response) => {
                if (response.body.length > 1) {
                    response.body.forEach((user) => {
                        expect(user.username.toLowerCase()).to.equal(
                            pulledUser.username.toLowerCase()
                        ) ||
                            expect(user.firstName.toLowerCase()).to.equal(
                                pulledUser.username.toLowerCase()
                            ) ||
                            expect(user.lastName.toLowerCase()).to.equal(
                                pulledUser.username.toLowerCase()
                            )
                    })
                } else {
                    expect(response.body[0].username.toLowerCase()).to.equal(
                        pulledUser.username.toLowerCase()
                    ) ||
                        expect(
                            response.body[0].firstName.toLowerCase()
                        ).to.equal(pulledUser.username.toLowerCase()) ||
                        expect(
                            response.body[0].lastName.toLowerCase()
                        ).to.equal(pulledUser.username.toLowerCase())
                }
            })
    })
})
