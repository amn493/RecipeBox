/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const chai = require('chai')

const chaiHTTP = require('chai-http')
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

const mongoose = require('mongoose')
require('../db.js')
// eslint-disable-next-line no-unused-vars
const JWT = require('jsonwebtoken')

const Recipe = mongoose.model('Recipe')

const { expect } = chai

chai.use(chaiHTTP)

const app = require('../app.js')

describe('Testing POST to /pinrecipe API (pin)', () => {
    let id
    beforeEach(async () => {
        // get a not-pinned recipe
        await Recipe.findOne({ pinned: false }).then((recipe) => {
            if (recipe) {
                id = recipe._id
            }
        })
    })
    // unpin recipe
    afterEach(async () => {
        // eslint-disable-next-line no-console
        console.log('\x1b[2m', '...unpinning test recipe...')
        return chai.request(app).post('/pinrecipe').send({
            id: id,
            pin: false
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/pinrecipe')
            .send({
                id: id,
                pin: true
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return the recipe with pinned === true', () =>
        chai
            .request(app)
            .post('/pinrecipe')
            .send({
                id: id,
                pin: true
            })
            .then((response) => {
                expect(response.body.pinned).to.equal(true)
            }))
})

describe('Testing POST to /pinrecipe API (unpin)', () => {
    let id
    beforeEach(async () => {
        // get a pinned recipe
        await Recipe.findOne({ pinned: true }).then((recipe) => {
            if (recipe) {
                id = recipe._id
            }
        })
    })
    // re-pin recipe
    afterEach(async () => {
        // eslint-disable-next-line no-console
        console.log('\x1b[2m', '...re-pinning test recipe...')
        return chai.request(app).post('/pinrecipe').send({
            id: id,
            pin: true
        })
    })
    it('should return 200 OK status', () =>
        chai
            .request(app)
            .post('/pinrecipe')
            .send({
                id: id,
                pin: false
            })
            .then((response) => {
                expect(response.status).to.equal(200)
            }))

    it('should return the recipe with pinned === false', () =>
        chai
            .request(app)
            .post('/pinrecipe')
            .send({
                id: id,
                pin: false
            })
            .then((response) => {
                expect(response.body.pinned).to.equal(false)
            }))
})
