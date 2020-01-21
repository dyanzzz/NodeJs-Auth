var express = require('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session)
var passport = require('passport')
var ejs = require('ejs')
var engine = require('ejs-mate')
var passportConf = require('./passport')
var User = require('./models/user')

var app = express();

// membuat koneksi database
mongoose.connect('mongodb+srv://admin:adminqwerty@cluster0-bky5t.mongodb.net/db-mongoose?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDb connected'))
.catch(err => console.log(err));

//Midleware
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'Hello',
    store: new MongoStore({
        url: 'mongodb+srv://admin:adminqwerty@cluster0-bky5t.mongodb.net/db-mongoose?retryWrites=true&w=majority',
        autoReconnect: true
    }),
}))
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(passport.initialize())
app.use(passport.session())

//get
app.get('/', function(req, res, next){
    res.render('home')
})

app.get('/login', function(req, res, next){
    if(req.user) {
        return res.redirect('/')
    }else{
        res.render('login')
    }
})

app.get('/profile', function(req, res, next){
    res.render('profile')
})

//posst
app.post('/login', passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login'
}))

app.get('/logout', function(req, res, next){
    req.logout()
    res.redirect('/')
})

app.post('/create-user', function(req, res, next){
    var user = new User()
    user.email = req.body.email
    user.password = req.body.password
    user.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.json(user)
        }
    })
})



//setup server
app.listen(3000, function(err){
    if(err){
        console.log(err)
    }else{
        console.log("Server run in port 3000")
    }
})
