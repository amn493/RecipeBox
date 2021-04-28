/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing route handler for GET /tags ', () => {
    // Title of the call in the test
    it('should return 200 OK status', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/tags')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.status).to.equal(200)
            }))

    it('should return all tags', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/tags')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.body.length).to.be.greaterThan(0)
            }))

    it('should not return any tags from a blockedTags array passed through query string', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get(
                `/tags?blockedTags=${['keto', 'glutenfree'].reduce(
                    (acc, tag) => `${acc}&blockedTags=${tag}`,
                    ''
                )}`
            )
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                expect(response.body).not.include('keto')
                expect(response.body).not.include('glutenfree')
            }))

    it('should only return tag fields', () =>
        // Describe what the test is looking for
        chai
            .request(app)
            .get('/tags')
            .then((response) => {
                // Have chai request app.js and then call the url to that route handler
                response.body.forEach((item) => expect(item).to.be.a('string'))
            }))
})
