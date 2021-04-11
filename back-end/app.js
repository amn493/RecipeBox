// import and instantiate express
const express = require('express') // CommonJS import style!

const app = express() // instantiate an Express object

const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const multer = require('multer') // middleware to handle HTTP POST requests with file uploads
const path = require('path')
const axios = require('axios') // middleware for making requests to APIs
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

// passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const JWT = require('jsonwebtoken')

// mongoose + models
const mongoose = require('mongoose')
require('./db.js')

const User = mongoose.model('User')
const Recipe = mongoose.model('Recipe')
const Comment = mongoose.model('Comment')
const Tag = mongoose.model('Tag')

// use the bodyparser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use(morgan('dev')) // dev style gives a concise color-coded style of log output

// serve static files
app.use(express.static(path.join(__dirname, '../front-end/public')))

// CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    next()
})

// MULTER

// object for storage option for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, path.join(__dirname, '../front-end/public/uploads')),
    filename: (req, file, cb) =>
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        )
})

// middleware for multer (save files with new name + proper extension to avoid collisions)
const upload = multer({
    fileFilter: (req, file, cb) =>
        cb(null, ['image/jpeg', 'image/png'].includes(file.mimetype)),
    storage: storage
})

// function for choosing a random profile picture
const getRandomStarterProPic = () => {
    const imagePaths = [
        'starterProfilePictures/RBX_PFP_Blue.png',
        'starterProfilePictures/RBX_PFP_Gold.png',
        'starterProfilePictures/RBX_PFP_Green.png',
        'starterProfilePictures/RBX_PFP_Magenta.png',
        'starterProfilePictures/RBX_PFP_Red.png',
        'starterProfilePictures/RBX_PFP_Violet.png'
    ]
    const index = Math.floor(Math.random() * imagePaths.length)
    return imagePaths[index]
}

// PASSPORT

// jwt strategy
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        async (payload, done) => {
            // find user from token

            // eslint-disable-next-line consistent-return
            User.findById(payload.sub, (err, user) => {
                if (err) {
                    done(err, false)
                } else {
                    // user doesn't exist
                    if (!user) {
                        return done(null, false)
                    }

                    // user exists
                    done(null, user)
                }
            })
        }
    )
)

// local strategy

// create account
passport.use(
    'createaccount',
    new LocalStrategy(
        { passReqToCallback: true },
        (req, username, password, done) => {
            process.nextTick(() => {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to log in already exists

                // eslint-disable-next-line consistent-return
                User.findOne({ username: username }, (err, user) => {
                    // if there are any errors, return the error
                    if (err) {
                        return done(err)
                    }

                    // check to see if theres already a user with that username
                    if (user) {
                        req.passportErrorMessage = 'Username is already taken'
                        return done(null, false)
                    }
                    // if there is no user with that username
                    // create the user
                    const newUser = new User({
                        username: username,
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        bio: '',
                        followers: [],
                        following: [],
                        liked: [],
                        imagePath: getRandomStarterProPic(),
                        blockedUsers: [],
                        notificationSettings: {
                            emailNotifications: true,
                            likes: true,
                            comments: true,
                            follows: true
                        },
                        createdAt: Date.now()
                    })

                    newUser.password = newUser.generateHash(password)

                    // save the user
                    newUser.save((error) => {
                        if (error) {
                            throw error
                        }
                        return done(null, newUser)
                    })
                })
            })
        }
    )
)

// authenticate account
passport.use(
    'signin',
    new LocalStrategy(
        { passReqToCallback: true },
        (req, username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err, false)
                }
                if (!user) {
                    req.passportErrorMessage = 'Incorrect username'
                    return done(null, false)
                }
                if (!user.validPassword(password)) {
                    req.passportErrorMessage = 'Incorrect password'
                    return done(null, false)
                }
                return done(null, user)
            })
        }
    )
)

// jwt sign token
const signToken = (user) =>
    JWT.sign(
        {
            iss: 'RecipeBox',
            sub: user.id,
            iat: Date.now(),
            exp: new Date().setDate(new Date().getDate() + 1) // tokens expire one day from now
        },
        process.env.JWT_SECRET
    )

// middleware for adding passport error messages to res
app.use((req, res, next) => {
    if (req.passportErrorMessage) {
        res.passportErrorMessage = req.passportErrorMessage
    }
    next()
})

/* Begin GET Requests */

app.get('/recipe', (req, res, next) => {
    // fetch recipe where slug === req.query.slug from database

    axios
        .get('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
        .then((apiResponse) => res.json(apiResponse.data[0]))
        .catch((err) => next(err))
})

app.get('/usersbyname', (req, res, next) => {
    // fetch users where username === req.query.name
    // or firstName === req.query.name
    // or lastName === req.query.name from database

    User.find({ $text: { $search: req.query.name } })
        .then((users) => res.json(users))
        .catch((err) => next(err))
})

app.get('/feedrecipes', (req, res, next) => {
    // fetch a list of recipes given an array of users they are following

    // let currentTime = Date.now() for future use
    axios
        .get('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
        .then((apiResponse) => res.json(apiResponse.data))
        .catch((err) => next(err))
})

app.get('/usersbyid', (req, res, next) => {
    // fetch users where id === req.query.id from database

    axios
        .get('https://my.api.mockaroo.com/user.json?key=f6a27260')
        .then((apiResponse) => res.json(apiResponse.data))
        .catch((err) => next(err))
})

app.get('/userbyid', (req, res, next) => {
    // fetch user where _id === req.query.id from database

    axios
        .get('https://my.api.mockaroo.com/user.json?key=f6a27260')
        .then((apiResponse) => res.json(apiResponse.data[0]))
        .catch((err) => next(err))
})

app.get('/userbyslug', (req, res, next) => {
    // fetch user where slug === req.query.slug from database

    User.find({ slug: req.query.slug })
        .then((user) => res.json(user))
        .catch((err) => next(err))
})

app.get('/comments', (req, res, next) => {
    // fetch comments where recipe === req.query.recipeID from database

    axios
        .get('https://my.api.mockaroo.com/comment.json?key=f6a27260')
        .then((apiResponse) => res.json(apiResponse.data))
        .catch((err) => next(err))
})

app.get('/recipesbyuser', (req, res, next) => {
    // fetch recipes where user.id === req.query.userID from database

    axios
        .get('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
        .then((apiResponse) => res.json(apiResponse.data.slice(0, 18)))
        .catch((err) => next(err))
})

app.get('/tags', (req, res, next) => {
    const filter = {}

    // don't include tags that the user has blocked
    if (req.query.blockedTags) {
        filter.tag = {
            $nin: Array.isArray(req.query.blockedTags)
                ? req.query.blockedTags
                : [req.query.blockedTags]
        }
    }

    // fetch tags from database
    Tag.find(filter)
        .then((tags) => {
            res.json(tags.map((tag) => tag.tag))
        })
        .catch((err) => next(err))
})

// eslint-disable-next-line consistent-return
app.get('/filteredrecipes', (req, res, next) => {
    const filter = {}

    // filter recipe names by keyword
    if (req.query.keyword !== '') {
        filter.$text = { $search: req.query.keyword }
    }

    // filter recipe tags
    if (
        !(
            req.query.tags.length === 0 ||
            (req.query.tags.length === 1 && req.query.tags[0] === '')
        )
    ) {
        filter.$and = req.query.tags
            .filter((tag) => tag !== '')
            .map((tag) => ({ tags: tag }))
    }

    // filter recipes by liked if request is coming from recipe box page
    if (req.query.liked !== undefined) {
        // send back an empty array if user's liked is empty
        if (req.query.liked === '') {
            return res.json([])
        }

        // eslint-disable-next-line no-underscore-dangle
        filter._id = {
            $in: req.query.liked.filter((liked) => liked !== '')
        }
    }

    // find recipes matching the filter
    Recipe.find(filter)
        .then((recipes) => {
            res.json(recipes)
        })
        .catch((err) => next(err))
})

app.get(
    '/signedinuser',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ user: req.user })
    }
)

/* Begin POST Requests */

app.post(
    '/signin',
    passport.authenticate('signin', {
        session: false
    }),
    (req, res) => {
        res.json({
            token: signToken(req.user)
        })
    }
)

app.post(
    '/createaccount',
    passport.authenticate('createaccount', {
        session: false
    }),
    (req, res) => {
        res.json({
            token: signToken(req.user)
        })
    }
)

app.post('/signout', (req, res) => {
    req.logout()
    res.send('Signed out user')
})

app.post('/comment', (req, res) => {
    // store new comment

    const data = {
        recipe: req.body.recipe,
        user: req.body.user,
        comment: req.body.comment,
        createdAt: Date.now()
    }

    res.json(data)
})

// recursive function for adding new tags to database and updating counts of existing tags
const updateTags = (tags, i, cb, next) => {
    if (i === tags.length) {
        cb()
    } else {
        Tag.updateOne(
            { tag: tags[i] },
            {
                $set: {
                    tag: tags[i]
                },
                $inc: {
                    count: 1
                }
            },
            { upsert: true },
            (err) => {
                if (err) {
                    next(err)
                }
                updateTags(tags, i + 1, cb, next)
            }
        )
    }
}

app.post('/newrecipe', upload.single('recipeimage'), (req, res, next) => {
    // new recipe
    const newRecipe = {
        user: {
            id: req.body.userID,
            username: req.body.username
        },
        name: req.body.name,

        imagePath: path.join('/uploads/', req.file.filename),
        tags: req.body.tags.split(',').filter((tag) => tag !== ''),
        caption: req.body.caption,
        ingredients: req.body.ingredients
            .split(',')
            .map((ingredient) => ingredient.trim())
            .filter((ingredient) => ingredient !== ''),
        instructions: req.body.instructions
            .split(',')
            .map((instruction) => instruction.trim())
            .filter((instruction) => instruction !== ''),
        likes: 0,
        createdAt: Date.now()
    }

    // save new recipe to database
    new Recipe(newRecipe)
        .save()
        .then((recipe) => {
            // add new tags to database and update counts of existing tags
            updateTags(recipe.tags, 0, res.json.bind(res, recipe), next)
        })
        .catch((err) => {
            next(err)
        })
})

app.post('/blockuser', (req, res) => {
    // update signed-in user's blockedUsers array appropriately
    // update signed-in users's following/followers array appropriately
    // update blocked user's following/followers array appropriately

    let updatedSignedInBlockedUsers = req.body.signedInblockedUsers

    let updatedSignedInUserFollowing = req.body.signedInUserFollowing
    let updatedSignedInUserFollowers = req.body.signedInUserFollowers
    let updatedblockedUserFollowing = req.body.blockedUserFollowing
    let updatedblockedUserFollowers = req.body.blockedUserFollowers

    if (req.body.addBlock) {
        updatedSignedInBlockedUsers.push(req.body.blockedUserID)

        if (updatedSignedInUserFollowing.includes(req.body.blockedUserID)) {
            updatedSignedInUserFollowing.splice(
                updatedSignedInUserFollowing.indexOf(req.body.blockedUserID),
                1
            )
            updatedblockedUserFollowers.splice(
                updatedblockedUserFollowers.indexOf(req.body.signedInUserID),
                1
            )
        }
        if (updatedSignedInUserFollowers.includes(req.body.blockedUserID)) {
            updatedSignedInUserFollowers.splice(
                updatedSignedInUserFollowers.indexOf(req.body.blockedUserID),
                1
            )
            updatedblockedUserFollowing.splice(
                updatedblockedUserFollowing.indexOf(req.body.signedInUserID),
                1
            )
        }
    } else {
        updatedSignedInBlockedUsers.splice(
            updatedSignedInBlockedUsers.indexOf(req.body.blockedUserID),
            1
        )
    }

    res.json({
        signedInBlockedUsers: updatedSignedInBlockedUsers,
        signedInUserFollowing: updatedSignedInUserFollowing,
        signedInUserFollowers: updatedSignedInUserFollowers,
        blockedUserFollowers: updatedblockedUserFollowers,
        blockedUserFollowing: updatedblockedUserFollowing
    })
})

app.post('/blocktag', (req, res) => {
    // update signed-in user's blockedTags array appropriately

    const updatedSignedInBlockedTags = req.body.signedInBlockedTags

    if (req.body.addBlock) {
        updatedSignedInBlockedTags.push(req.body.tagToBlockOrUnblock)
    } else {
        updatedSignedInBlockedTags.splice(
            updatedSignedInBlockedTags.indexOf(req.body.tagToBlockOrUnblock),
            1
        )
    }

    res.json({ signedInBlockedTags: updatedSignedInBlockedTags })
})

app.post('/likerecipe', (req, res) => {
    // update signed-in user (_id === req.body.userID)'s liked array appropriately

    const updatedLiked = req.body.liked
    if (req.body.like) {
        updatedLiked.push(req.body.recipeID)
    } else {
        updatedLiked.splice(updatedLiked.indexOf(req.body.recipeID), 1)
    }

    // update recipe (_id === req.body.recipeID)'s likes count
    res.json(updatedLiked)
})

app.post('/followuser', (req, res) => {
    // update signed-in user (_id === req.body.userID)'s following array appropriately
    // update followed user's followers array appropriately

    const updatedSignedInUserFollowing = req.body.signedInUserFollowing
    const updatedFollowedUserFollowers = req.body.followedUserFollowers

    if (req.body.follow) {
        updatedSignedInUserFollowing.push(req.body.followedUserID)
        updatedFollowedUserFollowers.push(req.body.userID)
    } else {
        updatedSignedInUserFollowing.splice(
            updatedSignedInUserFollowing.indexOf(req.body.followedUserID),
            1
        )
        updatedFollowedUserFollowers.splice(
            updatedFollowedUserFollowers.indexOf(req.body.userID),
            1
        )
    }

    res.json({
        signedInUserFollowing: updatedSignedInUserFollowing,
        FollowedUserFollowers: updatedFollowedUserFollowers
    })
})

app.post('/notificationsettings', (req, res) => {
    // recieve updated notification settings
    const updatedNotificationSettings = {
        email: req.body.email,
        likes: req.body.likes,
        comments: req.body.comments,
        followers: req.body.followers,
        // posts: req.body.posts,
        id: req.body.id
    }

    // update the settings

    // send response
    res.json(updatedNotificationSettings)
})

app.post('/updateuserinfo', upload.single('profilepicture'), (req, res) => {
    // recieve post data from updating user's basic info
    const updatedUserInfo = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
        id: req.body.id,
        imagePath: path.join('/uploads/', req.file.filename)
    }

    // update the user's user object (in database)

    // send a response to the user (sending data back to test)
    res.json(updatedUserInfo)
})

// export the express app we created to make it available to other modules
module.exports = app
