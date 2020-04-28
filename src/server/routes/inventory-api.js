const express = require("express");

const { getUser, consumeLootBox, rewardHeroes } = require("../db/user-repo");
const { generateRewards } = require("../db/heroes-repo")

const router = express.Router();

//API for getting user's current collection
router.post("/collection", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }

    const collection = getUser(req.user.userId).collection;

    const payload = JSON.stringify(collection);

    res.status(200).json(payload);
})

//API for getting user's current amount of lootboxes
router.get("/lootboxes", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }

    const lootboxes = getUser(req.user.userId).lootboxes;
    const payload = JSON.stringify({lootboxes: lootboxes});

    res.status(200).json(payload);
})

router.post("/openbox", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }
    const user = getUser(req.user.userId);
    if(!consumeLootBox(user.userId)){
        res.status(400).send(); //User did not have enough boxes
    } else {
        const rewards = generateRewards(3);
        rewardHeroes(user.userId, rewards)
        const payload = JSON.stringify(rewards);

        res.status(200).json(payload)
    }
})

module.exports = router;