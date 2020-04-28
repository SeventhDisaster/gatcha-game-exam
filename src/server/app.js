const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const authApi = require('./routes/auth-api');
const heroesApi = require('./routes/heroes-api');
const collectionApi = require('./routes/collection-api');
const Users = require('./db/user-repo');

const WsHandler = require('./ws-handler');

const app = express();

app.use(bodyParser.json());

WsHandler.init(app);

app.use(session({
    secret: 'This string helps me encrypt session cookies',
    resave: false,
    saveUninitialized: false
}));

// Serves the static files: HTML CSS and Bundle.JS
app.use(express.static('public'));

passport.use(new LocalStrategy(
    {
        usernameField: 'userId',
        passwordField: 'password'
    },
    function (userId, password, done) {
        const ok = Users.verifyUser(userId, password);

        if(!ok){
            return done(null, false, {message: 'Invalid username or password'})
        }

        const user = Users.getUser(userId);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function (userId, done) {
    const user = Users.getUser(userId);

    if(user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// -- ROUTES -- This is where API's are set up
app.use('/api', authApi)
app.use('/api', heroesApi);
app.use('/api', collectionApi);

//Handles 404.
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
})

module.exports = app;