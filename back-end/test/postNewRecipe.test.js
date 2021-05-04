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
const JWT = require('jsonwebtoken')
const User = mongoose.model('User')


describe('Testing route handler for POST /newrecipe ', () => {
    let userID = ''
    let name = 'oatmeal'
    let tags = JSON.stringify(['breakfast','oats','vegan'])
    let caption = 'The best morning oatmeal!'
    let ingredients = JSON.stringify(['rolled oats','banana','blueberries','chia seeds'])
    let instructions = JSON.stringify(['boil oats in water','add toppings,enjoy!'])
    let pinned = 'false'
    let idOne = ''

    // Pull in a "random" user
    before(async () => {
        await User.findOne({}).then((user) => {
            userID = user._id.toString()
        })
    })

    it('POST should return 200 OK status', () => {
        return chai.request(app)
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
            expect(response.status).to.equal(200)
            idOne = response.body._id.toString()
        })
    }).timeout(4000)

    // POST a new recipe
    name = 'maple-brown-sugar-oatmeal'
    ingredients = JSON.stringify(['rolled oats','banana','blueberries','chia seeds','brown sugar','maple syrup'])
    let idTwo = ''

    it('should return a recipe object with the right field names and types ', () => {
        return chai.request(app)
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
            expect(response.body).have.property('_id')
            expect(response.body).have.property('tags')
            expect(response.body).have.property('ingredients')
            expect(response.body).have.property('instructions')
            expect(response.body).have.property('user').that.is.a('string')
            expect(response.body).have.property('name').that.is.a('string')
            expect(response.body).have.property('imagePath')
            expect(response.body).have.property('caption').that.is.a('string')
            expect(response.body).have.property('likes')
            expect(response.body).have.property('createdAt')
            expect(response.body).have.property('pinned')
            idTwo = response.body._id.toString()
        })
    }).timeout(4000)

    after(async () => {
        // Delete the recipes
        await chai.request(app)
        .post('/deleterecipe')
        .send({'id': idOne})
        .then(response)

        await chai.request(app)
        .post('/deleterecipe')
        .send({'id': idTwo})
        .then(response)
    })
})