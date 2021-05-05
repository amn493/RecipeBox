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

const Recipe = mongoose.model('Recipe')
const Tag = mongoose.model('Tag')
const User = mongoose.model('User')

const { expect } = chai

chai.use(chaiHTTP)

// snowballFactory for stemming words in the same way that mongoDB does
const snowballFactory = require('snowball-stemmers')

const stemmer = snowballFactory.newStemmer('english')

const app = require('../app.js')

// If Mockaroo is down, change whatever is in your route to "res.send('Text')" and comment out the axios call to make sure the test runs.
describe('Testing route handler for GET /filteredrecipes ', () => {
    let recipeCount = 0
    let likedArray = []
    let userid
    let filtertag = ''
    let filterkeyword = ''
    let filtertags = []
    let newfilterkeyword = ''
    before(async () => {
        // for testing whether all recipe documents are returned
        // with empty filter
        await Recipe.countDocuments({}).then((count) => {
            recipeCount = count
        })

        // for testing whether route returns recipes containing
        // a given tag that is existent in the database
        await Tag.findOne({
            count: { $gt: 1 }
        }).then((tag) => {
            filtertag = tag.tag
        })

        // for testing whether route returns recipes containing
        // a given keyword
        await Recipe.findOne({}).then((recipe) => {
            // eslint-disable-next-line prefer-destructuring
            filterkeyword = stemmer.stem(recipe.name.split(' ')[0])
        })

        // for testing whether route returns a user's liked recipes
        // with when passed a liked array
        await User.findOne({
            liked: { $exists: true, $type: 'array', $ne: [] }
        }).then((user) => {
            if (user) {
                likedArray = user.liked
                userid = user._id
            }
        })

        // for testing combination of tags and keyword
        await Recipe.findOne({
            $nor: [
                { tags: { $exists: false } },
                { tags: { $size: 0 } },
                { tags: { $size: 1 } }
            ]
        }).then((recipe) => {
            // eslint-disable-next-line prefer-destructuring
            newfilterkeyword = stemmer.stem(recipe.name.split(' ')[0])
            filtertags = recipe.tags
        })
    })

    it('should return 200 OK status', () =>
        chai
            .request(app)
            .get('/filteredrecipes?keyword=&tags=')
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return all recipes when filter is empty', () =>
        chai
            .request(app)
            .get('/filteredrecipes?keyword=&tags=')
            .then((response) => {
                expect(response.body.length).to.equal(recipeCount)
            }))

    it('elements of the response array should be recipe objects', () =>
        chai
            .request(app)
            .get('/filteredrecipes?keyword=&tags=')
            .then((response) => {
                expect(response.body[0])
                    .to.have.property('user')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('name')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('imagePath')
                    .that.is.a('array')
                expect(response.body[0])
                    .to.have.property('tags')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('caption')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('ingredients')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('instructions')
                    .that.is.an('array')
                expect(response.body[0])
                    .to.have.property('likes')
                    .that.is.a('number')
                expect(response.body[0])
                    .to.have.property('createdAt')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('slug')
                    .that.is.a('string')
                expect(response.body[0])
                    .to.have.property('_id')
                    .that.is.a('string')
            }))

    it('should only return recipes whose names contain a given keyword given such recipe(s) exist in database', () =>
        chai
            .request(app)
            .get(`/filteredrecipes?keyword=${filterkeyword}&tags=`)
            .then((response) => {
                response.body.forEach((recipe) =>
                    expect(
                        recipe.name
                            .toLowerCase()
                            .split(' ')
                            .map((word) => stemmer.stem(word))
                    ).to.include(filterkeyword.toLowerCase())
                )
            }))

    it('should only return recipes that contain a given tag given such recipe(s) exist in database', () =>
        chai
            .request(app)
            .get(
                `/filteredrecipes?keyword=${[filtertag].reduce(
                    (acc, tag) => `${acc}&tags=${tag}`,
                    `&tags=`
                )}`
            )
            .then((response) => {
                response.body.forEach((recipe) =>
                    expect(recipe.tags).to.include(filtertag)
                )
            }))

    it('should only return recipes whose name contains given keyword, and whose tags array contains multiple given tags,', () =>
        chai
            .request(app)
            .get(
                `/filteredrecipes?keyword=${newfilterkeyword}${filtertags.reduce(
                    (acc, tag) => `${acc}&tags=${tag}`,
                    `&tags=`
                )}`
            )
            .then((response) => {
                filtertags.forEach((tag) =>
                    response.body.forEach((recipe) =>
                        expect(recipe.tags).to.include(tag)
                    )
                )
                response.body.forEach((recipe) =>
                    expect(
                        recipe.name
                            .toLowerCase()
                            .split(' ')
                            .map((word) => stemmer.stem(word))
                    ).to.include(newfilterkeyword.toLowerCase())
                )
            }))
    it('given a liked array of some user in the database, it should return each recipe whose id is in the liked array', () =>
        chai
            .request(app)
            .get(
                `/filteredrecipes?userid=${userid}&keyword=&tags=${likedArray.reduce(
                    (acc, liked) => `${acc}&liked=${liked}`,
                    `&liked=`
                )}`
            )
            .then((response) => {
                response.body.forEach((recipe) =>
                    expect(likedArray).to.include(recipe._id)
                )
            }))
})
