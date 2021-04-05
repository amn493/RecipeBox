const chai = require("chai")
const sinon = require('sinon')
const chaiHTTP = require("chai-http")
const expect = chai.expect

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require("../app.js")

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe("Testing POST for /comment API", () => { // Title of the call in the test
    it("should return 200 OK status", () => { // Describe what the test is looking for
        return chai.request(app).post('/comment').then((response) => { // Have chai request app.js and then call the url to that route handler
            expect(response.status).to.equal(200)
        })
    })

    it("should return the comment that was added", () => {

        // Create a mock comment
        let mockComment = {
            recipe: 2,
            user: 5,
            comment: 'Love this recipe!'
        }

        let resultResponse = chai.request(app).post('/comment').send(mockComment).then((response) => {
            expect(response.body).to.contain.keys(
                'recipe', 'user', 'comment', 'createdAt'
            )
        })

        return resultResponse
        
    })
})