
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
        return false; //User does not exist for some reason
    }

    if(user.lootboxes < 1) {
        return false; //User cannot open lootboxes as they have none left
    } else {
        user.lootboxes--;
        return true;
    }
}

function boughtLootBox(userId, free) {
    const user = getUser(userId);

    if(!user){
        return false; //User does not exist for some reason
    }

    if(!free){
        if(user.timeFragments < 100) {
            return false;
        }
        user.lootboxes++;
        user.timeFragments -= 100;
    } else {
        user.lootboxes++;
    }

    return true;
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

    console.log(user);
    console.log(heroIndex);

    if(!user){
        throw("Invalid user ID: " + userId)
    }

    const milledHero = user.collection[heroIndex];
    if(!milledHero){
        throw("Hero does not exist on index: " + heroIndex)
    }

    let heroValue;
    switch (milledHero.rarity) {
        case 1: heroValue = 100; break;
        case 2: heroValue = 200; break;
        case 3: heroValue = 300; break;
        default: break; //This should not happen
    }

    user.collection.splice(heroIndex, 1); //Cuts the hero out of the list
    user.timeFragments += heroValue; //Receive payment for sold unit

    updateHeroIndexes(userId); //Update after splice

    return true;
}

module.exports = {getUser, verifyUser, createUser, resetAllUsers, consumeLootBox, boughtLootBox, rewardHeroes, didMillHero}