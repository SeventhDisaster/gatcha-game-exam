const express = require("express");

const { heroes } = require("../db/heroes-repo");

const router = express.Router();


//This endpoint is open to everyone.
//No authentication requirements
router.get("/heroes", (req, res) => {
    const payload = JSON.stringify(heroes)

    res.status(200).json(payload);
})

//This PUT API is not implemented in the front-end, but exists to fill data into the heroes repository
router.put("/heroes", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }
    const data = JSON.parse(req.body.hero)
    heroes.push(hero)

})

module.exports = router;