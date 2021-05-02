const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

chai.use(chaiHTTP)
require('dotenv').config({ silent: true })

const mongoose = require('mongoose')
require('../db.js')

const User = mongoose.model('User')

const app = require('../app.js')

describe('Testing GET for /usersbyid API', () => {
    // get 3 users "randomly"
    let userIDs = []
    let userObjs = []
    before(async () => {
        await User.find({})
            .limit(3)
            .then((user) => {
                user.forEach((singleUser) => {
                    userIDs.push(singleUser._id)
                    userObjs.push(singleUser)
                })
            })
    })

    it('should return 200 OK status', () => {
        return chai
            .request(app)
            .get(
                `/usersbyid?id=${userIDs[0]}&id=${userIDs[1]}&id=${userIDs[2]}`
            )
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    })

    it('should return 3 valid user objects', () => {
        return chai
            .request(app)
            .get(
                `/usersbyid?id=${userIDs[0]}&id=${userIDs[1]}&id=${userIDs[2]}`
            )
            .then((response) => {
                //user 1
                expect(response.body[0])
                    .to.have.property('username')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('followers')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('notificationSettings')
                    .that.is.an('object')
                    .with.deep.property('emailNotifications')

                //user 2
                expect(response.body[1])
                    .to.have.property('username')
                    .that.is.a('string')
                expect(response.body[1])
                    .to.have.property('followers')
                    .that.is.an('array')
                expect(response.body[1])
                    .to.have.property('notificationSettings')
                    .that.is.an('object')
                    .with.deep.property('emailNotifications')

                //user 3
                expect(response.body[2])
                    .to.have.property('username')
                    .that.is.a('string')
                expect(response.body[2])
                    .to.have.property('followers')
                    .that.is.an('array')
                expect(response.body[2])
                    .to.have.property('notificationSettings')
                    .that.is.an('object')
                    .with.deep.property('emailNotifications')
            })
    })

    it('should return same 3 user objects as called', () => {
        // they're reverse order because I pushed the array earlier vs appending
        return chai
            .request(app)
            .get(
                `/usersbyid?id=${userIDs[0]}&id=${userIDs[1]}&id=${userIDs[2]}`
            )
            .then((response) => {
                //user 1
                expect(response.body[0].username).to.equal(userObjs[2].username)

                //user 2
                expect(response.body[1].username).to.equal(userObjs[1].username)

                //user 3
                expect(response.body[2].username).to.equal(userObjs[0].username)
            })
    })
})
