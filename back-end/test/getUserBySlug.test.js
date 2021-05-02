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

// Group of tests
describe('Testing route handler for GET /userbyslug ', () => {
    // Pull in a "random" user
    let userSlug = ''
    let userObj = {}
    before(async () => {
        await User.findOne({}).then((user) => {
            userSlug = user.slug
            userObj = user
        })
    })
    it('should return 200 OK status ', () => {
        return chai
            .request(app)
            .get(`/userbyslug?slug=${userSlug}`)
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    }).timeout(3000)

    it('should return a user object with the correct fields', () => {
        return chai
            .request(app)
            .get(`/userbyslug?slug=${userSlug}`)
            .then((response) => {
                expect(response.body).to.have.property('username')
                expect(response.body).to.have.property('password')
                expect(response.body).to.have.property('firstName')
                expect(response.body).to.have.property('lastName')
                expect(response.body).to.have.property('bio')
                expect(response.body).to.have.property('followers')
                expect(response.body).to.have.property('following')
                expect(response.body).to.have.property('liked')
                expect(response.body).to.have.property('slug')
                expect(response.body).to.have.property('imagePath')
                expect(response.body).to.have.property('_id')
            })
    }).timeout(8000)

    it('should return a user object with the correct field types', () => {
        return chai
            .request(app)
            .get(`/userbyslug?slug=${userSlug}`)
            .then((response) => {
                expect(response.body)
                    .to.have.property('username')
                    .that.is.a('string')
                expect(response.body)
                    .to.have.property('followers')
                    .that.is.an('array')
            })
    }).timeout(8000)

    it('should return the same user object that was found', () => {
        return chai
            .request(app)
            .get(`/userbyslug?slug=${userSlug}`)
            .then((response) => {
                expect(JSON.stringify(response.body)).to.equal(
                    JSON.stringify(userObj)
                )
            })
    }).timeout(8000)
})
