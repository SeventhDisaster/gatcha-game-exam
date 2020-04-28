
const users = new Map();

// user ID = Username
function getUser(userId) {
    return users.get(userId)
}

//Returns true if passwords match
function verifyUser(id, password) {
    const user = getUser(id);
    if(!user){
        return false;
    }

    return user.password === password;
}


function createUser(userId, password) {
    if(getUser(userId)){
        return false; //User with the same ID already exists
    }

    const user = {
        userId: userId, //ID is the username
        password: password,
        lootboxes: 3, //Users always start with 3 lootboxes
        collection: [], //Users have nothing in their collection to begin with
        timeFragments: 0, //Currency
    }

    users.set(userId, user);

    return true; //User successfully created.
}

function resetAllUsers() {
    users.clear();
}

function consumeLootBox(userId) {
    const user = getUser(userId);

    if(!user){
        throw("Invalid user ID: " + userId)
    }

    if(user.lootboxes < 1) {
        return false; //User cannot open lootboxes as they have none left
    } else {
        user.lootboxes--;
        return true;
    }
}

//Because heroes are spliced out when milled, indexes in collections property must be updated so as to not cause errors in frontend
function updateHeroIndexes(userId) {
    const user = getUser(userId);
    for(let i = 0; i < user.collection.length; i++){
        user.collection[i].index = i;
    }
}

//Function takes an array of heroes and pushes into user's collection
function rewardHeroes(userId, heroes) {
    const user = getUser(userId);
    for(let hero of heroes){
        hero.index = heroes.length;
        user.collection.push(hero);
    }
    updateHeroIndexes(userId);
}

function didMillHero(userId, heroIndex){
    const user = getUser(userId)

    if(!user){
        throw("Invalid user ID: " + userId)
    }

    const milledHero = user.collection[heroIndex];
    if(!milledHero){
        throw("Hero does not exist on index: " + heroIndex)
    }

    let heroValue;
    switch (milledHero.rarity) {
        case 1: heroValue = 100; return;
        case 2: heroValue = 200; return;
        case 3: heroValue = 300; return;
        default: heroValue = 0; //This should not happen
    }

    user.timeFragments += heroValue;
}

module.exports = {getUser, verifyUser, createUser, resetAllUsers, consumeLootBox, rewardHeroes, didMillHero}