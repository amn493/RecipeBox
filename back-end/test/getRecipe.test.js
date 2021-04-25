const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require('../app.js')

describe('Testing route handler for GET /recipe ', () => {
    it('should return 200 OK status', () => {
        return chai.request(app).get('/recipe?slug=bread-sandwich').then((response) => {
            expect(response.status).to.equal(200)
        })
    })

    it('should return a recipe object with the correct fields', () => {
        return chai.request(app).get('/recipe?slug=bread-sandwich').then((response) => {
            expect(response.body).to.have.property('_id')
            expect(response.body).to.have.property('tags')
            expect(response.body).to.have.property('ingredients')
            expect(response.body).to.have.property('instructions')
            expect(response.body).to.have.property('slug')
            expect(response.body).to.have.property('user')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('imagePath')
            expect(response.body).to.have.property('caption')
            expect(response.body).to.have.property('likes')
            expect(response.body).to.have.property('createdAt')
        })
    }).timeout(8000)

    it('should return a recipe object with the correct field types', () => {
        return chai.request(app).get('/recipe?slug=bread-sandwich').then((response) => {
            expect(response.body).to.have.property('name').that.is.a('string')
            expect(response.body).to.have.property('ingredients').that.is.an('array')
            expect(response.body).to.have.property('imagePath').that.is.a('string')
        })
    }).timeout(8000)
})
