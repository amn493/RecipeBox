// import and instantiate express
const express = require('express') // CommonJS import style!

const app = express() // instantiate an Express object

const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const multer = require('multer') // middleware to handle HTTP POST requests with file uploads
const path = require('path')
const axios = require('axios') // middleware for making requests to APIs
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env

// use the bodyparser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data
app.use(morgan('dev')) // dev style gives a concise color-coded style of log output

// CORS

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
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
    ),
})

// middleware for multer (save files with new name + proper extension to avoid collisions)
const upload = multer({
  fileFilter: (req, file, cb) =>
    cb(null, ['image/jpeg', 'image/png'].includes(file.mimetype)),
  storage: storage,
})

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

  axios
    .get('https://my.api.mockaroo.com/user.json?key=f6a27260')
    .then((apiResponse) => res.json(apiResponse.data))
    .catch((err) => next(err))
})

app.get('/feedrecipes', (req, res, next) => {
  // fetch a list of recipes given an user's name (thus getting their likes)
  // as well as a timestamp

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

  axios
    .get('https://my.api.mockaroo.com/user.json?key=f6a27260')
    .then((apiResponse) => res.json(apiResponse.data[0]))
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
  // fetch all tags from database

  axios
    .get('https://my.api.mockaroo.com/tag.json?key=f6a27260')
    .then((apiResponse) => res.json(apiResponse.data.map((tag) => tag.tag)))
    .catch((err) => next(err))
})

app.get('/filteredrecipes', (req, res, next) => {
  // fetch recipes where name contains req.query.keyword and tags includes all tags in req.query.tags from database

  axios
    .get('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
    // mock filtering to demonstrate how the filter works
    .then((apiResponse) =>
      res.json(
        apiResponse.data.filter(
          (recipe) =>
            (req.query.keyword !== ''
              ? recipe.name
                  .toLowerCase()
                  .includes(req.query.keyword.toLowerCase())
              : true) &&
            (req.query.tags.length === 0 ||
            (req.query.tags.length === 1 && req.query.tags[0] === '')
              ? true
              : req.query.tags.reduce(
                  (acc, filterTag) =>
                    acc &&
                    (filterTag !== '' ? recipe.tags.includes(filterTag) : true),
                  true
                ))
        )
      )
    )
    .catch((err) => next(err))
})

app.post('/comment', (req, res) => {
  // store new comment

  const data = {
    recipe: req.body.recipe,
    user: req.body.user,
    comment: req.body.comment,
    createdAt: Date.now(),
  }
  res.json(data)
})

app.post('/newrecipe', upload.single('recipeimage'), (req, res) => {
  // store new recipe

  const newRecipe = {
    user: {
      id: +req.body.userID,
      username: req.body.username,
    },
    name: req.body.name,

    imagePath: path.join('/uploads/', req.file.filename),
    tags: req.body.tags.split(','),
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
    createdAt: Date.now(),
  }
  res.json(newRecipe)

  // update/store each tag where tag.tag in req.body.tags (if tag doesn't exist count = 1, else count += 1)
})

app.post('/blockuser', (req, res) => {
  // update signed-in user (_id === req.body.userID)'s blockedUsers array appropriately

  const updatedBlockedUsers = req.body.blockedUsers
  if (req.body.addBlock) {
    updatedBlockedUsers.push(req.body.blockedUserID)
  } else {
    updatedBlockedUsers.splice(
      updatedBlockedUsers.indexOf(req.body.blockedUserID),
      1
    )
  }

  res.json(updatedBlockedUsers)
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
    FollowedUserFollowers: updatedFollowedUserFollowers,
  })
})

app.post('/notificationSettings', (req, res) => {
  // recieve updated notification settings
  const updatedNotificationSettings = {
    email: req.body.email,
    likes: req.body.likes,
    comments: req.body.comments,
    followers: req.body.followers,
    posts: req.body.posts,
    id: req.body.id,
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
    id: req.body.id,
    imagePath: path.join('/uploads/', req.file.filename),
  }

  // update the user's user object (in database)

  // send a response to the user (sending data back to test)
  res.json(updatedUserInfo)
})

// export the express app we created to make it available to other modules
module.exports = app
