/* eslint-disable */
// Test expected output when given valid input

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

// Group of tests
describe('Testing route handler for GET /usersbyname ', () => {
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

    it('should return an array where each user has at least one matching field (username)', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.username}`)
            .then((response) => {
                response.body.forEach((user) => {
                    expect([
                        user.username.toLowerCase(),
                        user.firstName.toLowerCase(),
                        user.lastName.toLowerCase()
                    ]).to.include(pulledUser.username.toLowerCase())
                })
            })
    })

    it('should return an array where each user has at least one matching field (first name)', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.firstName}`)
            .then((response) => {
                response.body.forEach((user) => {
                    expect([
                        user.username.toLowerCase(),
                        user.firstName.toLowerCase(),
                        user.lastName.toLowerCase()
                    ]).to.include(pulledUser.firstName.toLowerCase())
                })
            })
    })

    it('should return an array where each user has at least one matching field (last name)', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${pulledUser.lastName}`)
            .then((response) => {
                response.body.forEach((user) => {
                    expect([
                        user.username.toLowerCase(),
                        user.firstName.toLowerCase(),
                        user.lastName.toLowerCase()
                    ]).to.include(pulledUser.lastName.toLowerCase())
                })
            })
    })
})
