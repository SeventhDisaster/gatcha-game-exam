const express = require("express");

const { heroes, generateLootBoxes } = require("../db/heroes-repo");

const router = express.Router();

router.get("/heroes", (req, res) => {
    const payload = JSON.stringify(heroes)

    res.status(200).json(payload);
})

module.exports = router;