const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const path = require('path');

const WsHandler = require('./ws-handler');

const app = express();

app.use(bodyParser.json());

WsHandler.init(app);

app.use(session({
    secret: 'Top secret string to encrypt session cookies',
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
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    const user = Users.getUser(id);

    if(user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// -- ROUTES -- This is where API's are set up


//Handles 404.
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
})

module.exports = app;