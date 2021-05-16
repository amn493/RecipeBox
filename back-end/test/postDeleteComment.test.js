/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const User = mongoose.model('User')
const Recipe = mongoose.model('Recipe')
const Comment = mongoose.model('Recipe')

const { expect } = chai

const app = require('../app.js')

chai.use(chaiHTTP)

describe('Testing route handler for POST /deletecomment ', () => {
    let recipeAuthorID = ''
    let recipeID = ''
    let commentingUserID = ''
    let commentNotifsOn = false

    let commentID = ''
    before(async () => {
        //find random recipe to comment on
        await Recipe.findOne({}).then(async (recipe) => {
            recipeID = recipe._id
            // turn off comment notifications for recipe author for tests
            await User.findOne({ _id: recipe.user }).then(
                async (recipeAuthor) => {
                    // get id of recipe author user for tests
                    recipeAuthorID = recipeAuthor._id
                    if (recipeAuthor.notificationSettings.comments) {
                        commentNotifsOn = true
                        await chai
                            .request(app)
                            .post('/notificationsettings')
                            .send({
                                emailNotifications:
                                    recipeAuthor.notificationSettings
                                        .emailNotifications,
                                likes: recipeAuthor.notificationSettings.likes,
                                comments: false,
                                follows:
                                    recipeAuthor.notificationSettings.follows,
                                userID: recipeAuthor._id
                            })
                    }
                    // get id of commenting user for tests
                    await User.findOne({ _id: { $ne: recipeAuthor._id } }).then(
                        (commentingUser) => {
                            commentingUserID = commentingUser._id
                        }
                    )
                }
            )
        })
    })
    // post comment to delete before each test
    beforeEach(async () => {
        await chai
            .request(app)
            .post('/comment')
            .send({
                user: commentingUserID,
                comment: 'great recipe!',
                recipe: recipeID
            })
            .then((resComment) => {
                commentID = resComment.body._id
            })
    })

    // turn back on comment notifications for recipe author after tests
    after(async () => {
        if (commentNotifsOn) {
            await User.findOne({ _id: recipeAuthorID }).then(async (user) => {
                await chai.request(app).post('/notificationsettings').send({
                    emailNotifications:
                        user.notificationSettings.emailNotifications,
                    likes: user.notificationSettings.likes,
                    comments: true,
                    follows: user.notificationSettings.follows,
                    userID: user._id
                })
            })
        }
    })

    it('should return 200 OK status', () => {
        return chai
            .request(app)
            .post('/deletecomment')
            .send({ id: commentID })
            .then((response) => {
                expect(response.status).to.equal(200)
            })
    }).timeout(4000)

    it('should return no instances of the deleted comment in the database', () => {
        return chai
            .request(app)
            .post('/deletecomment')
            .send({ id: commentID })
            .then(() => {
                commentCount = Comment.countDocuments({ _id: commentID }).then(
                    (count) => {
                        expect(count).to.equal(0)
                    }
                )
            })
    }).timeout(4000)
})
