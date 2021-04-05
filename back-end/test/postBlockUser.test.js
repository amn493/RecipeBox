const chai = require("chai")
const chaiHTTP = require("chai-http")
const expect = chai.expect
const faker = require('faker');

chai.use(chaiHTTP)

const app = require("../app.js")

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


//dummy data
let addBlock = true;
let signedInUserId = 23
let signedInBlockedUsers = [1, 5, 24, 12, 17, 16, 39]
let signedInUserFollowing = [4, 5, 24, 100, 8, 9, 12, 44]
let signedInUserFollowers = [4, 5, 12, 22, 8, 20, 11, 46]
let blockedUserID = 8
let blockedUserFollowing = [45, 12, 15, 9, 23, 44, 1]
let blockedUserFollowers = [12, 45, 3, 33, 2, 28, 18]

describe("Testing POST to /blockusers API", () => { 
    it("should return 200 OK status", () => { 
       return chai.request(app)
        .post('/blockuser')
        .send({addBlock: addBlock, 
            signedInBlockedUsers: signedInUserId, 
            signedInBlockedUsers: signedInBlockedUsers,
            signedInUserFollowing: signedInUserFollowing,
            signedInUserFollowers: signedInUserFollowers,
            blockedUserID: blockedUserID,
            blockedUserFollowing: blockedUserFollowing,
            blockedUserFollowers: blockedUserFollowers}).then((response) => { 
            expect(response.status).to.equal(200)
            })
    }).timeout(4000)
})