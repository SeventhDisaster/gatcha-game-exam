//Full list of heroes - Hero list is based on protagonists from various japanese animation series

//Rarities range from 1-3 (1 is more common, 3 is very rare)
const heroes = [
    {
        name: "Midoriya Izuku",
        series: "Boku no Hero Academia",
        description: "A developing hero whose powers have yet to reach their full potential",
        rarity: 2
    },
    {
        name: "Kirigaya Kazuto",
        series: "Sword Art Online",
        description: "After being trapped inside a Virtual Reality MMO game, he became an extremely skilled virtual swordsman",
        rarity: 2
    },
    {
        name: "Nakajima Atsushi",
        series: "Bungou Stray Dogs",
        description: "A learning agent of the Armed Detective Agency, has the ability 'The Tiger Man', allowing him to heal himself of any wound",
        rarity: 1
    },
    {
        name: "Yuuki Yuuna",
        series:"Yuuki Yuuna wa Yuusha de aru",
        description: "A young heroine with a heart that drives her to perform heroic acts and always help those in need",
        rarity: 1
    },
    {
        name: "Asta",
        series: "Black Clover",
        description: "A boy with no magic and an impressive set of muscles, capable of using powers granted by him from a demon.",
        rarity: 1
    },
    {
        name: "Sora",
        series: "No Game No Life",
        description: "Attuned to the world of a shut-in gamer, he has become so proficient at any game so as to never lose",
        rarity: 1
    },
    {
        name: "Spike",
        series: "Cowboy Bebop",
        description: "Being a space cowboy isn't a job for everyone, Spike makes his living taking bounties in the solar system.",
        rarity: 3
    },
    {
        name: "Kuriyama Mirai",
        series: "Kyoukai no Kanata",
        description: "Using her own blood to draw a blade to vanquish the youmu, the manifestations of negative human emotions.",
        rarity: 2
    },
    {
        name: "Saitama",
        series: "One Punch Man",
        description: "A simple man who is just bored and also strong enough to destroy anything with a single punch.",
        rarity: 3
    },
    {
        name: "Satou Kazuma",
        series: "Kono Subarashii Sekai ni Shukufuku wo!",
        description: "An unfortunate young man who does his best to live life despite his fairly special comrades..",
        rarity: 1
    },
    {
        name: "Ains Ooal Gown",
        series: "Overlord",
        description: "Once a key member of the top guild in Yggdrasil, he found himself to be the sole strongest being in the new world.",
        rarity: 3
    },
    {
        name: "Ange le Carré",
        series: "Princess Principal",
        description: "A genious spy with the ability to tell when someone is lying. She also has a device that lets her fly for short periods of time.",
        rarity: 2
    },
    {
        name: "Eren Yeager",
        series: "Shingeki no Kyojin",
        description: "A developing titan slayer and holder, he can manouver around quickly and level buildings with his titan powers.",
        rarity: 1
    },
    {
        name: "Iwatani Naofumi",
        series: "Tate no Yuusha no Nariagari",
        description: "Once shunned for being the Shield Hero, he proved himself to be the most capable among the 4 sacred heroes.",
        rarity: 2
    },
    {
        name: "Goblin Slayer",
        series: "Goblin Slayer",
        description: "A man who knows the horrors of the goblins all too well, his sole creed is to rid the world of every goblin out there.",
        rarity: 2
    },
    {
        name: "Edward Elric",
        series: "Fullmetal Alchemist",
        description: "After losing an arm, a leg and his younger brother's body to a failed human transmutation, he's seeks to recover what was lost.",
        rarity: 1
    },
    {
        name: "Akame",
        series: "Akame ga Kill",
        description: "An extremely skillfull assassin of Night Raid, wielding the Murasame a blade where even the smallest cut is fatal.",
        rarity: 3
    }
]

//TODO: Implement rarity algorithm

const filterRare = (hero) => {
    return hero.rarity === 1;
}

const filterSRare = (hero) => {
    return hero.rarity === 2;
}

const filterSSRare = (hero) => {
    return hero.rarity === 3;
}

function getRandomHero() {
    let rarity;

    const roll = Math.random();
    if(roll > 0.6){
        if(roll > 0.9){
            rarity = 3;
        } else {
            rarity = 2;
        }
    } else {
        rarity = 1
    }

    let result;
    switch (rarity) {
        case 1:
            const rares = heroes.filter(filterRare);
            result = rares[Math.floor(Math.random() * rares.length)];
            break;
        case 2:
            const srares = heroes.filter(filterSRare);
            result = srares[Math.floor(Math.random() * srares.length)];
            break;
        case 3:
            const ssrares = heroes.filter(filterSSRare);
            result = ssrares[Math.floor(Math.random() * ssrares.length)];
            break;
        default: result = heroes;
            break;
    }

    //Here I get a deep copy of the hero objects, so as to not reuse the reference in every instance
    //Ref: https://scotch.io/bar-talk/copying-objects-in-javascript
    return JSON.parse(JSON.stringify(result));
}

function addHero(name, series, description, rarity) {
    if(!name || !series || !description || !rarity) {
        return false; //Do not add if everything is not filled out
    }
    heroes.push({
        name: name,
        series: series,
        description: description,
        rarity: rarity
    })
    return true;
}

function generateRewards(amount) {
    let rewards = [];
    for(let i = 0; i < amount; i++){
        rewards.push(getRandomHero())
    }
    return rewards;
}

module.exports = {heroes, generateRewards, addHero};