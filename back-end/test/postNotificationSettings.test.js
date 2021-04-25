/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
const JWT = require('jsonwebtoken')

const User = mongoose.model('User')

const { expect } = chai
// const faker = require('faker')

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing POST to /notificationsettings API', () => {
    it('should return 200 OK status', () => {
        // dummy user 6078f5faaa84a40750ad4518
        User.findOne(
            { _id: mongoose.Types.ObjectId('6078f5faaa84a40750ad4518') },
            (user) => {
                if (user) {
                    const {
                        emailNotifications
                    } = user.notificationSettings.emailNotifications
                    const { likes } = user.notificationSettings.likes
                    const { comments } = user.notificationSettings.comments
                    const { follows } = user.notificationSettings.follows
                    const { id } = user._id
                    return chai
                        .request(app)
                        .post('/notificationsettings')
                        .send({
                            emailNotifications: emailNotifications,
                            likes: likes,
                            comments: comments,
                            follows: follows,
                            userID: id
                        })
                        .then((response) => {
                            expect(response.status).to.equal(200)
                        })
                }
            }
        )
    })
    it('should return an object with correct field names', () => {
        // dummy user
        User.findOne(
            { _id: mongoose.Types.ObjectId('6078f5faaa84a40750ad4518') },
            (user) => {
                if (user) {
                    const {
                        emailNotifications
                    } = user.notificationSettings.emailNotifications
                    const { likes } = user.notificationSettings.likes
                    const { comments } = user.notificationSettings.comments
                    const { follows } = user.notificationSettings.follows
                    const { id } = user._id
                    return chai
                        .request(app)
                        .post('/notificationsettings')
                        .send({
                            emailNotifications: emailNotifications,
                            likes: likes,
                            comments: comments,
                            follows: follows,
                            userID: id
                        })
                        .then((response) => {
                            expect(response.body).to.have.property(
                                'notificationSettings'
                            )
                            expect(
                                response.body.notificationSettings
                            ).to.have.property('emailNotifications')
                            expect(
                                response.body.notificationSettings
                            ).to.have.property('likes')
                            expect(
                                response.body.notificationSettings
                            ).to.have.property('comments')
                            expect(
                                response.body.notificationSettings
                            ).to.have.property('follows')
                        })
                }
            }
        )
    })

    it('should return an object with correct field data types', () => {
        // dummy user
        User.findOne(
            { _id: mongoose.Types.ObjectId('6078f5faaa84a40750ad4518') },
            (user) => {
                if (user) {
                    const {
                        emailNotifications
                    } = user.notificationSettings.emailNotifications
                    const { likes } = user.notificationSettings.likes
                    const { comments } = user.notificationSettings.comments
                    const { follows } = user.notificationSettings.follows
                    const { id } = user._id
                    return chai
                        .request(app)
                        .post('/notificationsettings')
                        .send({
                            emailNotifications: emailNotifications,
                            likes: likes,
                            comments: comments,
                            follows: follows,
                            userID: id
                        })
                        .then((response) => {
                            expect(response.body.notificationSettings).to.be.an(
                                'object'
                            )
                            expect(
                                response.body.notificationSettings
                                    .emailNotifications
                            ).to.be.a('boolean')
                            expect(
                                response.body.notificationSettings.likes
                            ).to.be.a('boolean')
                            expect(
                                response.body.notificationSettings.comments
                            ).to.be.a('boolean')
                            expect(
                                response.body.notificationSettings.follows
                            ).to.be.a('boolean')
                        })
                }
            }
        )
    })
})
