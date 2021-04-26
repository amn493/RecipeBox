/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
const JWT = require('jsonwebtoken')

const User = mongoose.model('User')

const { expect } = chai
// const faker = require('faker')

chai.use(chaiHTTP)

const app = require('../app.js')

// const [signedinUser, setSignedInUser] = useState([])
// let signedInUserId = faker.datatype.number({max:50})
// useEffect(() => {
//     axios(`http://localhost:4000/userbyid?id=${signedInUserId}`)
//     .then((response) => {
//         setSignedInUser(response.data)
//     })

// const [userToBlock, setUserToBlock] = useState([])
// let blockedUserId = faker.datatype.number({max:50})
// if (blockedUserId===signedInUserId){
//     blockedUserId=blockedUserId+1
// }
// useEffect(() => {
//     axios(`http://localhost:4000/userbyid?id=${blockedUserId}`)
//     .then((response) => {
//         setUserToBlock(response.data)
//     })

describe('Testing POST to /blockusers API', () => {
    const addBlock = true
    let signedInUserID = ''
    let signedInBlockedUsers = ''
    let signedInUserFollowing = ''
    let signedInUserFollowers = ''
    let blockedUserID = ''
    let blockedUserFollowing = ''
    let blockedUserFollowers = ''
    beforeEach(async () => {
        // dummy users
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                signedInUserID = user._id
                signedInBlockedUsers = user.blockedUsers
                signedInUserFollowing = user.following
                signedInUserFollowers = user.followers
            }
        })
        await User.findOne({
            username: 'jsusstestaccount2'
        }).then((blockedUser) => {
            if (blockedUser) {
                blockedUserID = blockedUser._id
                blockedUserFollowing = blockedUser.following
                blockedUserFollowers = blockedUser.followers
            }
        })
    })

    afterEach(async () => {
        await User.findOne({ username: 'jsusstestaccount' }).then((user) => {
            if (user) {
                signedInUserID = user._id
                signedInBlockedUsers = user.blockedUsers
                signedInUserFollowing = user.following
                signedInUserFollowers = user.followers
            }
        })
        await User.findOne({
            username: 'jsusstestaccount2'
        }).then((blockedUser) => {
            if (blockedUser) {
                blockedUserID = blockedUser._id
                blockedUserFollowing = blockedUser.following
                blockedUserFollowers = blockedUser.followers
            }
            return chai.request(app).post('/blockuser').send({
                addBlock: false,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
        })
        console.log('\x1b[2m', '...unblocked test user...')
    })

    it('should return 200 OK status', () => {
        return chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    })

    it('should return an object with correct field names', () => {
        return chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.body).to.have.property('blockedUsers')
                expect(response.body).to.have.property('following')
                expect(response.body).to.have.property('followers')
            })
    })

    it('should return an object with correct field data', () => {
        return chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserID: signedInUserID,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.body.following).to.not.include(blockedUserID)
                expect(response.body.followers).to.not.include(blockedUserID)
                expect(response.body.blockedUsers).to.include(
                    blockedUserID.toString()
                )
            })
    })
})
