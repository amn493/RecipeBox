const chai = require('chai')
const chaiHTTP = require('chai-http')
const { response } = require('../app.js')

const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require('../app.js')
const fs = require('fs')

require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const User = mongoose.model('User')
const Recipe = mongoose.model('Recipe')


// For the future: 
// include tests to check tags are decremented
// comments are deleted and likes are removed (check by liking and commenting before)
// make sure recipe image is also deleted
describe('Testing route handler for POST /deleterecipe ', () => {
    let userID = ''
    let name = 'oatmeal'
    let tags = JSON.stringify(['breakfast,oats,vegan'])
    let caption = 'The best morning oatmeal!'
    let ingredients = JSON.stringify(['rolled oats,banana,blueberries,chia seeds'])
    let instructions = JSON.stringify(['boil oats in water,add toppings,enjoy!'])
    let pinned = 'false'
    let id = ''
    let slug = ''

    // Pull in a "random" user
    before(async () => {
        await User.findOne({}).then((user) => {
            userID = user._id.toString()
        })

        await chai.request(app)
        .post('/newrecipe')
        .set('content-type', 'multipart/form-data')
        .field('userID', userID)
        .field('name', name)
        .attach('recipeimage', fs.readFileSync('./test/image.png'), 'image.png')
        .field('tags', tags)
        .field('caption', caption)
        .field('ingredients', ingredients)
        .field('instructions', instructions)
        .field('pinned', pinned)
        .then((response) => {
            id = response.body._id.toString()
            slug = response.body.slug
        })
    })

    it('should return 200 OK status', () => {
        return chai.request(app)
        .post('/deleterecipe')
        .send({id})
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(4000)

    it('should return an empty array when searching for the recipe in the database', () => {
        Recipe.find({ 'slug': slug}).then((recipe) => {
            expect(recipe).to.be.empty
        })
    }).timeout(4000)
})