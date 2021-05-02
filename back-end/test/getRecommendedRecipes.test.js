/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing GET to /recommendedrecipes API', () => {
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .get('/recommendedrecipes')
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return at most 10 objects', () =>
        chai
            .request(app)
            .get('/recommendedrecipes')
            .then((response) => {
                expect(response.body.length).to.be.lessThanOrEqual(10)
            }))

    it('should return recipe objects', () =>
        chai
            .request(app)
            .get('/recommendedrecipes')
            .then((response) => {
                response.body.forEach((recipe) => {
                    expect(recipe).to.have.property('_id').that.is.a('string')
                    expect(recipe).to.have.property('tags').that.is.an('array')
                    expect(recipe)
                        .to.have.property('ingredients')
                        .that.is.an('array')
                    expect(recipe)
                        .to.have.property('instructions')
                        .that.is.an('array')
                    expect(recipe).to.have.property('slug').that.is.a('string')
                    expect(recipe).to.have.property('name').that.is.a('string')
                    expect(recipe)
                        .to.have.property('caption')
                        .that.is.a('string')
                    expect(recipe)
                        .to.have.property('imagePath')
                        .that.is.a('string')
                    expect(recipe).to.have.property('likes').that.is.a('number')
                })
            }))
})
