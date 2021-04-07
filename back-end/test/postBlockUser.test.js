const chai = require('chai')
const chaiHTTP = require('chai-http')

const { expect } = chai
const faker = require('faker')

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

// dummy data
const addBlock = true
const signedInUserId = 23
const signedInBlockedUsers = [1, 5, 24, 12, 17, 16, 39]
const signedInUserFollowing = [4, 5, 24, 100, 8, 9, 12, 44]
const signedInUserFollowers = [4, 5, 12, 22, 8, 20, 11, 46]
const blockedUserID = 8
const blockedUserFollowing = [45, 12, 15, 9, 23, 44, 1]
const blockedUserFollowers = [12, 45, 3, 33, 2, 28, 18]

describe('Testing POST to /blockusers API', () => {
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserId: signedInUserId,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            })).timeout(4000)

    it('should return an object with correct field names', () =>
        chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserId: signedInUserId,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.body).to.have.property('signedInBlockedUsers')
                expect(response.body).to.have.property('signedInUserFollowing')
                expect(response.body).to.have.property('signedInUserFollowers')
                expect(response.body).to.have.property('blockedUserFollowers')
                expect(response.body).to.have.property('blockedUserFollowing')
            })).timeout(8000)

    it('should return an object with correct field data', () =>
        chai
            .request(app)
            .post('/blockuser')
            .send({
                addBlock: addBlock,
                signedInUserId: signedInUserId,
                signedInBlockedUsers: signedInBlockedUsers,
                signedInUserFollowing: signedInUserFollowing,
                signedInUserFollowers: signedInUserFollowers,
                blockedUserID: blockedUserID,
                blockedUserFollowing: blockedUserFollowing,
                blockedUserFollowers: blockedUserFollowers
            })
            .then((response) => {
                expect(response.body.signedInBlockedUsers).to.include(
                    blockedUserID
                )
                expect(response.body.signedInUserFollowing).to.not.include(
                    blockedUserID
                )
                expect(response.body.signedInUserFollowers).to.not.include(
                    blockedUserID
                )
                expect(response.body.blockedUserFollowers).to.not.include(
                    signedInUserId
                )
                expect(response.body.blockedUserFollowers).to.not.include(
                    signedInUserId
                )
            })).timeout(8000)
})
