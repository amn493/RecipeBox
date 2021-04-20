const chai = require('chai')
const chaiHTTP = require('chai-http')
// const faker = require('faker')
const app = require('../app.js')

chai.use(chaiHTTP)
const { expect } = chai

describe('Testing POST to /followuser API', () => {
    it('should return 200 OK status', () => {
        // dummy data
        const profileUserID = 1
        const signedInUserID = 2

        return chai
            .request(app)
            .post('/followuser')
            .send({
                profileUserID: profileUserID,
                signedInUserID: signedInUserID
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            })
            .timeout(4000)
    })
})
