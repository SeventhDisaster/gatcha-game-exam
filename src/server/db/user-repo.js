const users = new Map();

// user ID = Username
function getUser(userId) {
    return users.get(userId)
}

//Returns true if passwords match
function verifyUser(id, pass) {
    const user = getUser(id);
    if(!user){
        return false;
    }
    return user.password === pass;
}


function generateUser(userId, password) {
    if(getUser(userId)){
        return false; //User with the same ID already exists
    }

    const user = {
        userId: userId, //ID is the username
        password: password,
    }

    users.set(userId, user);
    return true; //User successfully created.
}

function resetAllUsers() {
    users.clear();
}

module.exports = {getUser, verifyUser, generateUser, resetAllUsers}