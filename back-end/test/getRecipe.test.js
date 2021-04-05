const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require('../app.js')

describe('Testing route handler for GET /recipe ', () => {
  it('should return 200 OK status', () =>
    chai
      .request(app)
      .get('/recipe?slug=foobar-eggs')
      .then((response) => {
        expect(response.status).to.equal(200)
      }))

  it('should return a recipe object with correct fields', () =>
    chai
      .request(app)
      .get('/recipe?slug=foobar-eggs')
      .then((response) => {
        expect((response.body)[0]).to.have.property('name')
        expect((response.body)[0]).to.have.property('imagePath')
        expect((response.body)[0]).to.have.property('tags')
        expect((response.body)[0]).to.have.property('caption')
        expect((response.body)[0]).to.have.property('ingredients')
        expect((response.body)[0]).to.have.property('instructions')
        expect((response.body)[0]).to.have.property('likes')
        expect((response.body)[0]).to.have.property('createdAt')
        expect((response.body)[0]).to.have.property('slug')
        expect((response.body)[0]).to.have.property('id')
    })).timeout(8000)

    it('should return a recipe object with the correct field types', () => {
        return chai.request(app).get('/recipe?slug=foobar-eggs').then((response) => {
            expect((response.body)[0]).to.have.property('name').that.is.a('string')
            expect((response.body)[0]).to.have.property('ingredients').that.is.an('array')
            expect((response.body)[0]).to.have.property('id').that.is.a('int')
        })
    }).timeout(8000)

    it('should only return one recipe object ', () => {
        return chai.request(app).get('/recipe?slug=foobar-eggs').then((response) => {
            expect(response.body.length).to.equal(1)
        })
    }).timeout(3000)
})
