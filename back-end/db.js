const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')
const bcrypt = require('bcrypt')

// user schema
const User = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String, required: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    imagePath: { type: String, required: true },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedTags: [String],
    notificationSettings: {
        emailNotifications: { type: Boolean, required: true },
        likes: { type: Boolean, required: true },
        comments: { type: Boolean, required: true },
        follows: { type: Boolean, required: true }
    },
    createdAt: { type: Date, required: true }
})

// generate user slug
User.plugin(URLSlugs('username', { field: 'slug' }))

// recipe schema
const Recipe = new mongoose.Schema({
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String, required: true }
    },
    name: { type: String, required: true },
    imagePath: { type: String, required: true },
    tags: [String],
    caption: { type: String, required: true },
    ingredients: [String],
    instructions: [String],
    likes: { type: Number, required: true },
    createdAt: { type: Date, required: true }
})

// generate recipe slug
Recipe.plugin(URLSlugs('user.username name', { field: 'slug' }))

// comment schema
const Comment = new mongoose.Schema({
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    createdAt: { type: Date, required: true }
})

// tag schema
const Tag = new mongoose.Schema({
    tag: { type: String, required: true },
    count: { type: Number, required: true }
})

// BCRYPT
// check if password is valid
User.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

// generate password hash
User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

// register schemas so that mongoose knows about them
mongoose.model('User', User)
mongoose.model('Recipe', Recipe)
mongoose.model('Comment', Comment)
mongoose.model('Tag', Tag)

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@recipebox.m6t8g.mongodb.net/RecipeBox?retryWrites=true&w=majority`
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// log connection success or error
const dbConnection = mongoose.connection
dbConnection.on('error', (err) => console.log(`Connection error ${err}`))
dbConnection.once('open', () => console.log('Connected to database'))
