const chai = require('chai')
const chaiHTTP = require('chai-http')
const { response } = require('../app.js')

const { expect } = chai

// Chai will run the test on a port not being used. Avoids using active server for tests.
chai.use(chaiHTTP)

// Import our app.js where the route handlers are
const app = require('../app.js')
const fs = require('fs')

// So that the unit test run independent of data in the database
// 1. POST /newrecipe
// 2. GET /recipe
// 3. POST /deleterecipe

describe('Testing route handler for POST /newrecipe ', () => {
    // Using ash's userId
    let userID = '60822725cc7a916181964c79'
    let name = 'oatmeal'
    let tags = 'breakfast,oats,vegan'
    let caption = 'The best morning oatmeal!'
    let ingredients = 'rolled oats,banana,blueberries,chia seeds'
    let instructions = 'boil oats in water,add toppings,enjoy!'

    it('should return 200 OK status for POST /newrecipe', () => {
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
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(8000)

    // Get id object for /deleterecipe
    let id
    chai.request(app).get('/recipe?slug=oatmeal').then((response) => {
        id = response.body._id
    })
    
    // Delete the recipe
    chai.request(app)
        .post('/deleterecipe')
        .send({id})

    it('POST /newrecipe should return a recipe object with the right field names and types ', () => {
        return chai.request(app)
        .post('/newrecipe')
        .set('content-type', 'multipart/form-data')
        .field('userID', userID)
        .field('name', name)
        // Change file path to be image files availible to multer
        .attach('recipeimage', fs.readFileSync('./test/image.png'), 'image.png')
        .field('tags', tags)
        .field('caption', caption)
        .field('ingredients', ingredients)
        .field('instructions', instructions)
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
        })
    }).timeout(8000)

    // Get id object for /deleterecipe
    chai.request(app).get('/recipe?slug=oatmeal').then((response) => {
        id = response.body._id
    })
    
    // Delete the recipe
    chai.request(app)
        .post('/deleterecipe')
        .send({id})
})