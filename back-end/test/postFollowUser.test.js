/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const chai = require('chai')
const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true })

const mongoose = require('mongoose')
require('../db.js')

// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const User = mongoose.model('User')
const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('testing POST to /followuser API', () => {
    const follow = true
    let profileUserID = ''
    let signedInUserID = ''
    beforeEach(async () => {
        await User.findOne({ username: 'oe1999' }).then((signedInUser) => {
            if (signedInUser) {
                signedInUserID = signedInUser._id
            }
        })
        await User.findOne({ username: 'oe2' }).then((profileUser) => {
            if (profileUser) {
                profileUserID = profileUser._id
            }
        })
    })
    afterEach(async () => {
        await User.findOne({ username: 'oe1999' }).then((signedInUser) => {
            if (signedInUser) {
                signedInUserID = signedInUser._id
            }
        })
        await User.findOne({ username: 'oe2' }).then((profileUser) => {
            if (profileUser) {
                profileUserID = profileUser._id
            }
            return chai.request(app).post('/followuser').send({
                follow: false,
                signedInUserID: signedInUserID,
                profileUserID: profileUserID
            })
        })
        // eslint-disable-next-line no-console
        console.log('\x1b[2m', '...unfollowed test user...')
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                follow: follow,
                signedInUserID: signedInUserID,
                profileUserID: profileUserID
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))
    it('should return the following/unfollowing user with correct field names', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                follow: follow,
                signedInUserID: signedInUserID,
                profileUserID: profileUserID
            })
            .then((response) => {
                expect(response.body.signedInUser).to.have.property('following')
            }))
    it('should return the following/unfollowing user with correct field data', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                follow: follow,
                signedInUserID: signedInUserID,
                profileUserID: profileUserID
            })
            .then((response) => {
                expect(response.body.signedInUser.following).to.not.include(
                    profileUserID
                )
            }))
    it('should return the followed/unfollowed user with correct field names', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                follow: follow,
                signedInUserID: signedInUserID,
                profileUserID: profileUserID
            })
            .then((response) => {
                expect(response.body.profileUser).to.have.property('followers')
            }))
    it('should return the followed/unfollowed user with correct field data', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                follow: follow,
                signedInUserID: signedInUserID,
                profileUserID: profileUserID
            })
            .then((response) => {
                expect(response.body.profileUser.followers).to.not.include(
                    signedInUserID
                )
            }))
})
