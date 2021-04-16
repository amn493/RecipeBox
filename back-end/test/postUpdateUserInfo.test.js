// Test expected output when given val_id input
// Test expected output when given inval_id input

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

// For chai to run tests on an unused port
chai.use(chaiHTTP)

const app = require('../app.js')
const fs = require('fs')

// If Mockaroo is down, change route to "res.send('Text')" and 
// comment out the axios to make sure the test runs.


// Group of tests
describe('Testing route handler for POST /updateuserinfo ', () => {
    let username = 'userNameVal'
    let firstName = 'firstNameVal'
    let lastName = 'lastNameVal'
    let bio = 'bioVal'
    let _id = "606faf0fa9841f27a9e1bcea"

    it('should return 200 OK status ', () => {
        return chai.request(app)
        .post('/updateuserinfo')
        .set('content-type', 'multipart/form-data')
        .field('username', username)
        .field('firstName', firstName)
        .field('lastName', lastName)
        .field('bio', bio)
        .field('_id', _id)
        // Change file path to be image files availible to multer
        .attach('profilepicture', fs.readFileSync('./test/image.png'), 'image.png')
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(4000)

    it('should return a user object with the right field names and types', () => {
        return chai.request(app)
        .post('/updateuserinfo')
        .set('content-type', 'multipart/form-data')
        .field('username', username)
        .field('firstName', firstName)
        .field('lastName', lastName)
        .field('bio', bio)
        .field('id', _id)
        .attach('profilepicture', fs.readFileSync('./test/image.png'), 'image.png')
        .then((response) => {
            expect(response.body).have.property('username').that.is.a('string')
            expect(response.body).have.property('firstName').that.is.a('string')
            expect(response.body).have.property('lastName').that.is.a('string')
            expect(response.body).have.property('bio').that.is.a('string')
            expect(response.body).have.property('imagePath')
        })
    }).timeout(4000)
})