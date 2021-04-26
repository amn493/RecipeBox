/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
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

describe('Testing POST to /notificationsettings API', () => {
    let id = ''
    before(async () => {
        // dummy user
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                id = user._id
            }
        })
    })

    it('should return 200 OK status', () => {
        return chai
            .request(app)
            .post('/notificationsettings')
            .send({
                emailNotifications: true,
                likes: false,
                comments: true,
                follows: true,
                userID: id
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    })

    it('should return an object with correct field names', () => {
        return chai
            .request(app)
            .post('/notificationsettings')
            .send({
                emailNotifications: false,
                likes: true,
                comments: true,
                follows: true,
                userID: id
            })
            .then((response) => {
                expect(response.body).to.have.property('notificationSettings')
                expect(response.body.notificationSettings).to.have.property(
                    'emailNotifications'
                )
                expect(response.body.notificationSettings).to.have.property(
                    'likes'
                )
                expect(response.body.notificationSettings).to.have.property(
                    'comments'
                )
                expect(response.body.notificationSettings).to.have.property(
                    'follows'
                )
            })
    })

    it('should return an object with correct field data types', () => {
        return chai
            .request(app)
            .post('/notificationsettings')
            .send({
                emailNotifications: true,
                likes: true,
                comments: true,
                follows: true,
                userID: id
            })
            .then((response) => {
                expect(response.body.notificationSettings).to.be.an('object')
                expect(
                    response.body.notificationSettings.emailNotifications
                ).to.be.a('boolean')
                expect(response.body.notificationSettings.likes).to.be.a(
                    'boolean'
                )
                expect(response.body.notificationSettings.comments).to.be.a(
                    'boolean'
                )
                expect(response.body.notificationSettings.follows).to.be.a(
                    'boolean'
                )
            })
    })
})
