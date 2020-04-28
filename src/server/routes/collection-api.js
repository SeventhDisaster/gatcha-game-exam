const express = require("express");

const { getUser } = require("../db/user-repo");

const router = express.Router();

router.post("/collection", (req, res) => {
    if(!req.user){
        res.status(401).send();
        return;
    }

    const collection = getUser(req.body.userId).collection;
    const payload = JSON.stringify(collection);

    res.status(200).json(payload);

})

module.exports = router;