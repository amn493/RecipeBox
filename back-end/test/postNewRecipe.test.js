// Test expected output when given valID input
// Test expected output when given invalID input

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

// For chai to run tests on an unused port
chai.use(chaiHTTP)

const app = require('../app.js')
const fs = require('fs')

// If Mockaroo is down, change route to "res.send('Text')" and 
// comment out the axios to make sure the test runs.


// Group of tests
describe('Testing route handler for POST /newrecipe ', () => {
    /*
        newRecipe.append('userID', props.user._id)
        newRecipe.append('name', nameValue)
        newRecipe.append('recipeimage', imageFile)
        newRecipe.append('tags', tags)
        newRecipe.append('caption', captionValue)
        newRecipe.append('ingredients', ingredientValues)
        newRecipe.append('instructions', instructionValues)
    */
    let userID = '6070ccc13bd343389fcac3fc'
    let name = 'nameVal'
    let tags = ['tag1', 'tag2','tag3']
    let caption = 'captionVal'
    let ingredients = ['ingredient1', 'ingredient2', 'ingredient3']
    let instructions = ['intruction1', 'instruction2']

    it('should return 200 OK status ', () => {
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
            expect(response.status).to.equal(200)
        })
    }).timeout(8000)

    it('should return a recipe object with the right field names and types ', () => {
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
})