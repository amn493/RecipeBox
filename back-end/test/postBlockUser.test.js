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

describe('Testing POST to /blockuser API', () => {
    const addBlock = true
    let signedInUserID = ''
    let signedInBlockedUsers = ''
    let signedInUserFollowing = ''
    let signedInUserFollowers = ''
    let blockedUserID = ''
    let blockedUserFollowing = ''
    let blockedUserFollowers = ''
    beforeEach(async () => {
        // dummy users
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                signedInUserID = user._id
                signedInBlockedUsers = user.blockedUsers
                signedInUserFollowing = user.following
                signedInUserFollowers = user.followers
            }
        })
        await User.findOne({
            username: 'jsusstestaccount2'
        }).then((blockedUser) => {
            if (blockedUser) {
                blockedUserID = blockedUser._id
                blockedUserFollowing = blockedUser.following
                blockedUserFollowers = blockedUser.followers
            }
        })
    })

    afterEach(async () => {
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                signedInUserID = user._id
                signedInBlockedUsers = user.blockedUsers
                signedInUserFollowing = user.following
                signedInUserFollowers = user.followers
            }
        })
        await User.findOne({
            username: 'jsusstestaccount2'
        }).then((blockedUser) => {
            if (blockedUser) {
                blockedUserID = blockedUser._id
                blockedUserFollowing = blockedUser.following
                blockedUserFollowers = blockedUser.followers
            }
            return chai.request(app).post('/blockuser').send({
                addBlock: false,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
        })
        // eslint-disable-next-line no-console
        console.log('\x1b[2m', '...unblocked test user...')
    })

    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return an object with correct field names', () =>
        chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.body.currentUser).to.have.property(
                    'blockedUsers'
                )
                expect(response.body.currentUser).to.have.property('following')
                expect(response.body.currentUser).to.have.property('followers')
            }))

    it('should return an object with correct field data', () =>
        chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.body.currentUser.following).to.not.include(
                    blockedUserID
                )
                expect(response.body.currentUser.followers).to.not.include(
                    blockedUserID
                )
                expect(response.body.currentUser.blockedUsers).to.include(
                    blockedUserID.toString()
                )
            }))
})
