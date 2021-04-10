const chai = require("chai")
const chaiHTTP = require("chai-http")
const expect = chai.expect
const faker = require('faker');

chai.use(chaiHTTP)

const app = require("../app.js")

describe("Testing POST to /blockusers API", () => { 
    it("should return 200 OK status", () => { 

        //dummy data
        let email = true
        let likes = false
        let comments = true
        let followers = false
        let id = 21

       return chai.request(app)
        .post('/notificationsettings')
        .send({email: email, 
            likes: likes, 
            comments: comments,
            followers: followers,
            id: id
            }).then((response) => { 
                expect(response.status).to.equal(200)
            })
    }).timeout(4000)

    it("should return an object with correct field names", () => { 

        //dummy data
        let email = true
        let likes = false
        let comments = true
        let followers = false
        let id = 21

        return chai.request(app)
         .post('/notificationsettings')
         .send({email: email, 
            likes: likes, 
            comments: comments,
            followers: followers,
            id: id
            }).then((response) => { 
                expect(response.body).to.have.property('email')
                expect(response.body).to.have.property('likes')
                expect(response.body).to.have.property('comments')
                expect(response.body).to.have.property('followers')
                expect(response.body).to.have.property('id')
             })
     }).timeout(8000)

     it("should return an object with correct field data types", () => { 

        //dummy data
        let email = true
        let likes = false
        let comments = true
        let followers = false
        let id = 21

        return chai.request(app)
         .post('/blockuser')
         .send({email: email, 
            likes: likes, 
            comments: comments,
            followers: followers,
            id: id
            }).then((response) => { 
                expect(response.body.email).to.be.a('boolean')
                expect(response.body.likes).to.be.a('boolean')
                expect(response.body.comments).to.be.a('boolean')
                expect(response.body.followers).to.be.a('boolean')
                expect(response.body.id).to.be.an('int')
             })
     }).timeout(8000)
})