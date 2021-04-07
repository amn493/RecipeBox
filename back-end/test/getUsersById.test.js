const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing GET for /usersbyid API', () => {
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .get('/usersbyid')
            .then((response) => {
                expect(response.status).to.equal(200)
            })).timeout(3000)
    it('should return >1 user objects', () =>
        chai
            .request(app)
            .get('/usersbyid')
            .then((response) => {
                // user 1
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

                // user 2
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
            })).timeout(4000)
})
