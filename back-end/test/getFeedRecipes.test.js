/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const User = mongoose.model('User')

const { expect } = chai
// const faker = require('faker')

chai.use(chaiHTTP)

const app = require('../app.js')

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe('Testing GET for /feedrecipes API', () => {
    let following = []
    before(async () => {
        // dummy user
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                following = user.following
            }
        })
    })
    // Title of the call in the test
    it('should return 200 OK status', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get(
                `/feedrecipes?${
                    following.length > 0
                        ? following.reduce(
                              (acc, testfollowing) =>
                                  `${acc}&following=${testfollowing}`,
                              `following=`
                          )
                        : `following=`
                }&datemultiplier=${1}`
            )
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.status).to.equal(200)
            }))

    it("should solely return recipes from a user's following array", () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get(
                `/feedrecipes?${
                    following.length > 0
                        ? following.reduce(
                              (acc, testfollowing) =>
                                  `${acc}&following=${testfollowing}`,
                              `following=`
                          )
                        : `following=`
                }&datemultiplier=${1}`
            )
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                response.body.forEach((item) =>
                    expect(following).to.include(item.user)
                )
            }))

    it('should solely return recipes posted no later than 2 weeks ago (given dateMultiplier=1)', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get(
                `/feedrecipes?${
                    following.length > 0
                        ? following.reduce(
                              (acc, testfollowing) =>
                                  `${acc}&following=${testfollowing}`,
                              `following=`
                          )
                        : `following=`
                }&datemultiplier=${1}`
            )
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                response.body.forEach((item) =>
                    expect(Date.parse(item.createdAt)).to.be.greaterThan(
                        Date.now() - 12096e5
                    )
                )
            }))
})
