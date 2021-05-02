/* eslint-disable */
// Test expected output when given valid input
// Test expected output when given invalid input

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

// For chai to run tests on an unused port
chai.use(chaiHTTP)

const mongoose = require('mongoose')
require('../db.js')

const User = mongoose.model('User')

const app = require('../app.js')

// If Mockaroo is down, change route to "res.send('Text')" and
// comment out the axios to make sure the test runs.

// Group of tests
describe('Testing route handler for GET /usersbyname ', () => {
    // get 3 users "randomly"
    let userNames = []
    let userObjs = []
    before(async () => {
        await User.find({})
            .limit(3)
            .then((user) => {
                user.forEach((singleUser) => {
                    userNames.push(singleUser.username)
                    userObjs.push(singleUser)
                })
            })
    })
    it('should return 200 OK status ', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${userNames[0]}`)
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    }).timeout(3000)

    it('should return a valid user object', () => {
        return chai
            .request(app)
            .get(`/usersbyname?name=${userNames[0]}`)
            .then((response) => {
                //user 1
                expect(response.body[0])
                    .to.have.property('username')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('followers')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('notificationSettings')
                    .that.is.an('object')
                    .with.deep.property('emailNotifications')
            })
    })

    it('should return user object that was called', () => {
        // they're reverse order because I pushed the array earlier vs appending
        return chai
            .request(app)
            .get(`/usersbyname?name=${userNames[0]}`)
            .then((response) => {
                //user 1
                expect(response.body[0].username).to.equal(userObjs[0].username)
            })
    })
})
