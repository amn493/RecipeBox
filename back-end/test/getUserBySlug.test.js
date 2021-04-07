// Test expected output when given valid input
// Test expected output when given invalid input

const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai

// For chai to run tests on an unused port
chai.use(chaiHTTP)

const app = require('../app.js')

// If Mockaroo is down, change route to "res.send('Text')" and
// comment out the axios to make sure the test runs.

// Group of tests
describe('Testing route handler for GET /userbyslug ', () => {
    it('should return 200 OK status ', () =>
        chai
            .request(app)
            .get('/userbyslug')
            .then((response) => {
                expect(response.status).to.equal(200)
            })).timeout(3000)

    it('should return a user object with the correct fields', () =>
        chai
            .request(app)
            .get('/userbyslug')
            .then((response) => {
                expect(response.body[0]).to.have.property('username')
                expect(response.body[0]).to.have.property('password')
                expect(response.body[0]).to.have.property('firstName')
                expect(response.body[0]).to.have.property('lastName')
                expect(response.body[0]).to.have.property('bio')
                expect(response.body[0]).to.have.property('followers')
                expect(response.body[0]).to.have.property('following')
                expect(response.body[0]).to.have.property('liked')
                expect(response.body[0]).to.have.property('slug')
                expect(response.body[0]).to.have.property('imagePath')
                expect(response.body[0]).to.have.property('id')
            })).timeout(8000)

    it('should return a user object with the correct field types', () =>
        chai
            .request(app)
            .get('/userbyslug')
            .then((response) => {
                expect(response.body[0])
                    .to.have.property('username')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('followers')
                    .that.is.an('array')
                expect(response.body[0]).to.have.property('id').that.is.a('int')
            })).timeout(8000)

    it('should only return one object ', () =>
        chai
            .request(app)
            .get('/userbyslug')
            .then((response) => {
                expect(response.body.length).to.equal(1)
            })).timeout(3000)
})
