const express = require("express");
const passport = require("passport");

const Users = require('../db/user-repo');

const router = express.Router();

router.post("/login", passport.authenticate('local'), (req, res) => {
    res.status(204).send(); //Success with no content
})


router.post("/signup", (req, res) => {
    const created = Users.createUser(req.body.userId, req.body.password)

    if(!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate('local')(req, res, ()=> {
        req.session.save((err) => {
            if(err) {
                res.status(500).send(); //Server error, this shouldn't happen
                return;
            }

            res.status(201).send(); //201 Created
        });
    });
});

router.post('/logout', function(req, res) {
    req.logout();
    res.status(204).send(); //204 No Content, logout always successful
})

//Only return necessary information for front end, if request authenticated with valid session cookie
router.get('/user', function (req, res) {
    if(!req.user) {
        res.status(401).send();
        return;
    }

    //Return ID and some useful user data to display
    res.status(200).json({
        userId: req.user.userId,
        lootboxes: req.user.lootboxes,
        timeFragments: req.user.timeFragments
    })
})

router.delete("/user", function (req, res) {
    if(!req.user) {
        res.status(403).send(); //Not allowed to delete user if its not yourself
        return;
    }

    const deleted = Users.removeUser(req.user.userId);

    if (!deleted){
        res.status(500).send() //Failed to delete user
    }

    res.status(204).send();
})

module.exports = router;