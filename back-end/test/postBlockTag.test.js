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
const Tag = mongoose.model('Tag')

const { expect } = chai
// const faker = require('faker')

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing POST to /blocktag API', () => {
    const addBlock = true
    let signedInBlockedTags = ''
    let tagToBlockOrUnblock = ''
    let userID = ''
    beforeEach(async () => {
        // dummy users
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                userID = user._id
                signedInBlockedTags = user.blockedTags
            }
        })
        await Tag.findOne().then((tagForBlock) => {
            if (tagForBlock) {
                tagToBlockOrUnblock = tagForBlock.tag
            }
        })
    })

    afterEach(async () => {
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                userID = user._id
                signedInBlockedTags = user.blockedTags
            }
        })
        await Tag.findOne().then((tagForBlock) => {
            if (tagForBlock) {
                tagToBlockOrUnblock = tagForBlock.tag
            }
            return chai.request(app).post('/blocktag').send({
                addBlock: false,
                signedInBlockedTags: signedInBlockedTags,
                tagToBlockOrUnblock: tagToBlockOrUnblock,
                userID: userID
            })
        })
        // eslint-disable-next-line no-console
        console.log('\x1b[2m', '...unblocked test tag...')
    })

    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/blocktag')
            .send({
                addBlock: addBlock,
                signedInBlockedTags: signedInBlockedTags,
                tagToBlockOrUnblock: tagToBlockOrUnblock,
                userID: userID
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return an object with correct field names', () =>
        chai
            .request(app)
            .post('/blocktag')
            .send({
                addBlock: addBlock,
                signedInBlockedTags: signedInBlockedTags,
                tagToBlockOrUnblock: tagToBlockOrUnblock,
                userID: userID
            })
            .then((response) => {
                // eslint-disable-next-line no-unused-expressions
                expect(response.body)
                    .to.have.property('blockedTags')
                    .that.is.an('array').that.is.not.empty
            }))

    it('should return an object with correct field data', () =>
        chai
            .request(app)
            .post('/blocktag')
            .send({
                addBlock: addBlock,
                signedInBlockedTags: signedInBlockedTags,
                tagToBlockOrUnblock: tagToBlockOrUnblock,
                userID: userID
            })
            .then((response) => {
                expect(response.body.blockedTags).to.include(
                    tagToBlockOrUnblock
                )
            }))
})
