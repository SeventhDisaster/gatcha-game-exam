const express = require("express");

const { heroes, addHero } = require("../db/heroes-repo");

const router = express.Router();


//This endpoint is open to everyone.
//No authentication requirements/
router.get("/heroes", (req, res) => {
    const payload = JSON.stringify(heroes)

    res.status(200).json(payload);
})

//This PUT API is not implemented in the front-end, but exists to fill data into the heroes repository
router.put("/heroes", (req, res) => {
    const hero = req.body.hero
    addHero(hero.name, hero.series, hero.description, hero.rarity);
    res.status(201).send();
})

module.exports = router;