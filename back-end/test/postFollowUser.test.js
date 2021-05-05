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

describe('testing POST to /followuser API (follow)', () => {
    let profileUserID = ''
    let signedInUserID = ''
    beforeEach(async () => {
        await User.findOne({}).then((signedInUser) => {
            if (signedInUser) {
                signedInUserID = signedInUser._id
            }
        })
        await User.findOne({ followers: { $nin: signedInUserID } }).then(
            (profileUser) => {
                if (profileUser) {
                    profileUserID = profileUser._id
                }
            }
        )
    })
    afterEach(async () => {
        // unfollow user
        console.log('\x1b[2m', '...unfollowing test user...')
        chai.request(app).post('/followuser').send({
            signedInUserID: signedInUserID,
            profileUserID: profileUserID,
            follow: false
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: true
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))
    it('should return the following/unfollowing user with correct field names', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: true
            })
            .then((response) => {
                expect(response.body.signedInUser).to.have.property('following')
                expect(response.body.signedInUser).to.have.property('username')
                expect(response.body.signedInUser).to.have.property('firstName')
            }))
    it('should return the following/unfollowing user with correct field data', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: true
            })
            .then((response) => {
                expect(response.body.signedInUser.following).to.include(
                    profileUserID.toString()
                )
            }))
    it('should return the followed/unfollowed user with correct field names', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: true
            })
            .then((response) => {
                expect(response.body.profileUser).to.have.property('followers')
            }))
    it('should return the followed/unfollowed user with correct field data', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: true
            })
            .then((response) => {
                expect(response.body.profileUser.followers).to.include(
                    signedInUserID.toString()
                )
            }))
})

describe('testing POST to /followuser API (unfollow) ', () => {
    let profileUserID = ''
    let signedInUserID = ''
    beforeEach(async () => {
        await User.findOne({}).then((signedInUser) => {
            if (signedInUser) {
                signedInUserID = signedInUser._id
            }
        })
        await User.findOne({ followers: { $in: signedInUserID } }).then(
            (profileUser) => {
                if (profileUser) {
                    profileUserID = profileUser._id
                }
            }
        )
    })
    afterEach(async () => {
        // unfollow user
        console.log('\x1b[2m', '...following test user...')
        chai.request(app).post('/followuser').send({
            signedInUserID: signedInUserID,
            profileUserID: profileUserID,
            follow: true
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: false
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))
    it('should return the following/unfollowing user with correct field names', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: false
            })
            .then((response) => {
                expect(response.body.signedInUser).to.have.property('following')
            }))
    it('should return the following/unfollowing user with correct field data', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: false
            })
            .then((response) => {
                expect(response.body.signedInUser.following).to.not.include(
                    profileUserID.toString()
                )
            }))
    it('should return the followed/unfollowed user with correct field names', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: false
            })
            .then((response) => {
                expect(response.body.profileUser).to.have.property('followers')
                expect(response.body.profileUser).to.have.property('username')
                expect(response.body.profileUser).to.have.property('firstName')
            }))
    it('should return the followed/unfollowed user with correct field data', () =>
        chai
            .request(app)
            .post('/followuser')
            .send({
                signedInUserID: signedInUserID,
                profileUserID: profileUserID,
                follow: false
            })
            .then((response) => {
                expect(response.body.profileUser.followers).to.not.include(
                    signedInUserID.toString()
                )
            }))
})
