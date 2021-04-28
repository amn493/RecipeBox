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

//let recipeId


describe('Testing route handler for GET /recipe ', () => {
    /*// Using ash's userId
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
    }).timeout(8000)*/

    it('should return 200 OK status for GET /recipe', () => {
        return chai.request(app).get('/recipe?slug=oatmeal').then((response) => {
            expect(response.status).to.equal(200)
        })
    })

    // To send in /deleterecipe
    let recipeId 
    it('should return a recipe object with the correct fields', () => {
        return chai.request(app).get('/recipe?slug=oatmeal').then((response) => {
            expect(response.body).to.have.property('_id')
            expect(response.body).to.have.property('tags')
            expect(response.body).to.have.property('ingredients')
            expect(response.body).to.have.property('instructions')
            expect(response.body).to.have.property('slug')
            expect(response.body).to.have.property('user')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('imagePath')
            expect(response.body).to.have.property('caption')
            expect(response.body).to.have.property('likes')
            expect(response.body).to.have.property('createdAt')
            recipeId = response.body._id
        })
    }).timeout(8000)

    it('should return a recipe object with the correct field types', () => {
        return chai.request(app).get('/recipe?slug=oatmeal').then((response) => {
            expect(response.body).to.have.property('name').that.is.a('string')
            expect(response.body).to.have.property('ingredients').that.is.an('array')
            expect(response.body).to.have.property('imagePath').that.is.a('string')
        })
    }).timeout(8000)

    it('should return 200 OK status for /deleterecipe', () => {
        return chai.request(app)
        .post('/deleterecipe')
        .send(recipeId)
        .then((response) => {
            expect(response.status).to.equal(200)
        })
    }).timeout(8000)
})
