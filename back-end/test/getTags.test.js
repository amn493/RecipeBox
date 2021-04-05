const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require('../app.js')

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
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
        expect(response.body.length).to.equal(50)
      }))

  it('should only return tag fields', () =>
    // Describe what the test is looking for
    chai
      .request(app)
      .get('/tags')
      .then((response) => {
        // Have chai request app.js and then call the url to that route handler
        expect(typeof response.body[0]).to.equal('string')
      }))
})
