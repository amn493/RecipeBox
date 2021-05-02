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

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing POST to /blockuser API', () => {
    let existentUsername = ''
    before(async () => {
        // dummy users
        await User.findOne({}).then((user) => {
            if (user) {
                existentUsername = user.username
            }
        })
    })

    it('should return 200 OK status', () =>
        chai
            .request(app)
            .get('/usernametaken')
            .send({
                username: existentUsername
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return true if given username exists in user collection', () =>
        chai
            .request(app)
            .get(`/usernametaken?username=${existentUsername}`)
            .then((response) => {
                expect(response.body).to.equal(true)
            }))

    it('should return false if given username does not exist in user collection', () =>
        chai
            .request(app)
            .get('/usernametaken?username=!@~+-)([]<>/":,;"./%^&*')
            .then((response) => {
                expect(response.body).to.equal(false)
            }))
})
