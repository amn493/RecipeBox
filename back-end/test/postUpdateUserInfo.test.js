const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

// For chai to run tests on an unused port
chai.use(chaiHTTP)

const app = require('../app.js')
const fs = require('fs')
const path = require('path');

// For finding User from database
require('dotenv').config({ silent: true })
const mongoose = require('mongoose')
require('../db.js')
const User = mongoose.model('User')

// If Mockaroo is down, change route to "res.send('Text')" and 
// comment out the axios to make sure the test runs.

// Group of tests
describe('Testing route handler for POST /updateuserinfo ', () => {
    let username = 'testEditProfile'
    let firstName = 'neil'
    let lastName = 'armstrong'
    let bio = 'Testing edit profile!'

    // Pull in a "random" user
    let userID = ''
    let originalUsername = ''
    let originalFirstName = ''
    let originalLastName = ''
    let originalBio = ''
    let originalImagePath = ''
    before(async () => {
        await User.findOne({ $in:{imagePath: [
            'starterProfilePictures/RBX_PFP_Blue.png',
            'starterProfilePictures/RBX_PFP_Gold.png',
            'starterProfilePictures/RBX_PFP_Green.png',
            'starterProfilePictures/RBX_PFP_Magenta.png',
            'starterProfilePictures/RBX_PFP_Red.png',
            'starterProfilePictures/RBX_PFP_Violet.png'
        ]}}).then((user) => {
            userID = user._id.toString()
            originalUsername = user.username
            originalFirstName = user.firstName
            originalLastName = user.lastName
            originalBio = user.bio
            originalImagePath = user.imagePath
        })
    })

    it('should return 200 OK status ', () => {
        return chai.request(app)
        .post('/updateuserinfo')
        .set('content-type', 'multipart/form-data')
        .field('username', username)
        .field('firstName', firstName)
        .field('lastName', lastName)
        .field('bio', bio)
        .field('id', userID)
        .attach('profilepicture', fs.readFileSync('./test/image.png'), 'image.png')
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(4000)

    it('should return a user object with the right properties and types ', () => {
        return chai.request(app)
        .post('/updateuserinfo')
        .set('content-type', 'multipart/form-data')
        .field('username', username)
        .field('firstName', firstName)
        .field('lastName', lastName)
        .field('bio', bio)
        .field('id', userID)
        .then((response) => {
            expect(response.body).have.property('username').that.is.a('string')
            expect(response.body).have.property('firstName').that.is.a('string')
            expect(response.body).have.property('lastName').that.is.a('string')
            expect(response.body).have.property('bio').that.is.a('string')
            expect(response.body).have.property('imagePath')
        })
    }).timeout(4000)

    it('should return the profile to the original ', () => {
        return chai.request(app)
        .post('/updateuserinfo')
        .set('content-type', 'multipart/form-data')
        .field('username', originalUsername)
        .field('firstName', originalFirstName)
        .field('lastName', originalLastName)
        .field('bio', originalBio)
        .field('id', userID)
        .attach('profilepicture', fs.readFileSync(originalImagePath), path.basename(originalImagePath))
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(4000)

    it('should return the profile to the original ', () => {
        return chai.request(app)
        .post('/updateuserinfo')
        .set('content-type', 'multipart/form-data')
        .field('username', originalUsername)
        .field('firstName', originalFirstName)
        .field('lastName', originalLastName)
        .field('bio', originalBio)
        .field('id', userID)
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(4000)
})