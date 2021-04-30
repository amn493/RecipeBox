/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing GET to /recommendedusers API', () => {
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .get('/recommendedusers')
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return at most 10 objects', () =>
        chai
            .request(app)
            .get('/recommendedusers')
            .then((response) => {
                expect(response.body.length).to.be.lessThanOrEqual(10)
            }))

    it('should return user objects', () =>
        chai
            .request(app)
            .get('/recommendedusers')
            .then((response) => {
                response.body.forEach((user) => {
                    expect(user).to.have.property('_id').that.is.a('string')
                    expect(user)
                        .to.have.property('followers')
                        .that.is.an('array')
                    expect(user)
                        .to.have.property('following')
                        .that.is.an('array')
                    expect(user).to.have.property('liked').that.is.an('array')
                    expect(user)
                        .to.have.property('blockedUsers')
                        .that.is.an('array')
                    expect(user)
                        .to.have.property('blockedTags')
                        .that.is.an('array')
                    expect(user).to.have.property('slug').that.is.a('string')
                    expect(user)
                        .to.have.property('username')
                        .that.is.a('string')
                    expect(user).to.have.property('email').that.is.a('string')
                    expect(user)
                        .to.have.property('firstName')
                        .that.is.a('string')
                    expect(user)
                        .to.have.property('lastName')
                        .that.is.a('string')
                    expect(user).to.have.property('bio').that.is.a('string')
                    expect(user)
                        .to.have.property('imagePath')
                        .that.is.a('string')
                    expect(user)
                        .to.have.property('notificationSettings')
                        .that.is.an('object')
                })
            }))
})
