
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
        lootBoxes: 3, //Users always start with 3 lootboxes
        collection: [], //Users have nothing in their collection to begin with
        timeFragments: 0, //Currency
    }

    users.set(userId, user);

    return true; //User successfully created.
}

function resetAllUsers() {
    users.clear();
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

module.exports = {getUser, verifyUser, createUser, resetAllUsers, didMillHero}