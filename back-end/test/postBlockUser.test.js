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
    it('should return 200 OK status', () => {
        // dummy users
        User.findOne(
            { _id: mongoose.Types.ObjectId('6078f5faaa84a40750ad4518') },
            (user) => {
                if (user) {
                    const addBlock = true
                    const signedInUserId = user._id
                    const signedInBlockedUsers = user.blockedUsers
                    const signedInUserFollowing = user.following
                    const signedInUserFollowers = user.followers
                    User.findOne(
                        {
                            _id: mongoose.Types.ObjectId(
                                '606faf0fa9841f27a9e1bcea'
                            )
                        },
                        (blockedUser) => {
                            if (blockedUser) {
                                const blockedUserID = blockedUser._id
                                const blockedUserFollowing =
                                    blockedUser._following
                                const blockedUserFollowers =
                                    blockedUser._followers

                                return chai
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
                                    })
                            }
                        }
                    )
                }
            }
        )
    })

    it('should return an object with correct field names', () => {
        // dummy users
        User.findOne(
            { _id: mongoose.Types.ObjectId('6078f5faaa84a40750ad4518') },
            (user) => {
                if (user) {
                    const addBlock = true
                    const signedInUserId = user._id
                    const signedInBlockedUsers = user.blockedUsers
                    const signedInUserFollowing = user.following
                    const signedInUserFollowers = user.followers
                    User.findOne(
                        {
                            _id: mongoose.Types.ObjectId(
                                '606faf0fa9841f27a9e1bcea'
                            )
                        },
                        (blockedUser) => {
                            if (blockedUser) {
                                const blockedUserID = blockedUser._id
                                const blockedUserFollowing =
                                    blockedUser._following
                                const blockedUserFollowers =
                                    blockedUser._followers

                                return chai
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
                                        expect(response.body).to.have.property(
                                            'blockedUsers'
                                        )
                                        expect(response.body).to.have.property(
                                            'following'
                                        )
                                        expect(response.body).to.have.property(
                                            'followers'
                                        )
                                    })
                            }
                        }
                    )
                }
            }
        )
    })

    it('should return an object with correct field data', () => {
        // dummy users
        User.findOne(
            { _id: mongoose.Types.ObjectId('6078f5faaa84a40750ad4518') },
            (user) => {
                if (user) {
                    const addBlock = true
                    const signedInUserId = user._id
                    const signedInBlockedUsers = user.blockedUsers
                    const signedInUserFollowing = user.following
                    const signedInUserFollowers = user.followers
                    User.findOne(
                        {
                            _id: mongoose.Types.ObjectId(
                                '606faf0fa9841f27a9e1bcea'
                            )
                        },
                        (blockedUser) => {
                            if (blockedUser) {
                                const blockedUserID = blockedUser._id
                                const blockedUserFollowing =
                                    blockedUser._following
                                const blockedUserFollowers =
                                    blockedUser._followers

                                return chai
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
                                        expect(
                                            response.body.following
                                        ).to.not.include(signedInUserId)
                                        expect(
                                            response.body.followers
                                        ).to.not.include(signedInUserId)
                                    })
                            }
                        }
                    )
                }
            }
        )
    })
})
