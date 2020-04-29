const express = require("express");

const { getUser, consumeLootBox, boughtLootBox, rewardHeroes , didMillHero} = require("../db/user-repo");
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

//API Call for when the user mills (Sells) a hero. (DELETE method chosen as this method deletes a hero from the user's collection
router.delete("/collection", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }

    if(!didMillHero(req.user.userId, req.body.heroIndex)){
        res.status(500).send(); //If the hero was already deleted by the server, it cannot delete it again
    } else {
        res.status(204).send();
    }

})

//API Call for when a user purchases a lootbox
router.post("/lootboxes", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }

    if(!boughtLootBox(req.user.userId, false)){
        res.status(403).send() //Not enough time fragments to purchase
    }

    res.status(204).send(); //Bought lootbox
})

//API call for when a loot box is consumed
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