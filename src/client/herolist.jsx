import React from "react";

export class Herolist extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            heroes: null,
            error: null
        }
    }

    componentDidMount() {
        this.initializeHeroes();
    }

    initializeHeroes = async () => {
        const heroes = await this.getAllHeroes();
        this.setState(
            !heroes ? {error: "Error connecting to server", heroes: null} : { heroes: heroes }
        )
    }

    getAllHeroes = async () => {
        const url = "/api/heroes";

        let response;
        let payload;

        try{
            response = await fetch(url, {method: "GET",
            headers: {
                "Content-Type": "application/json"
            }})
            payload = await response.json();
        } catch (e) {
            console.log(e);
            return;
        }

        if(response.status !== 200) {return null;}

        return JSON.parse(payload);
    }

    parseRarity = (rarityValue) => {
        switch (rarityValue) {
            case 1: return "R"; //Rare
            case 2: return "SR"; //Super Rare
            case 3: return "SSR"; //Super Super Rare
            default: return "Error" //Should not happen
        }
    }

    colorRarity = (rarity) => {
        if(rarity === 3) {
            return "ssr reward"
        } else if (rarity === 2){
            return "sr reward"
        } else {
            return "r reward"
        }
    }

    createHeroList(heroes){
        return(
            <div className="collection-display">
                {heroes.map(hero => (
                    <React.Fragment key={hero.name}>
                        <div className={this.colorRarity(hero.rarity)}>
                            <h4 className="hero-rarity">{this.parseRarity(hero.rarity)}</h4>
                            <h4 className="hero-name">{hero.name}</h4>
                            <p className="series-name">{hero.series}</p>
                            <p className="hero-desc">{hero.description}</p>
                        </div>
                    </React.Fragment>))
                }
            </div>
        )
    }

    render() {
        let heroes = this.state.heroes
        let content;

        if (!heroes){
            content = <div className="error">{this.state.error}</div>
        } else {
            content = this.createHeroList(heroes);
        }

        return (
            <div className="loot-container">
                <div className="loot-header">
                    <h1>Hero List</h1>
                    <p>Every hero in this game has their own set rarity!</p>
                    <p className="r ra-text">Blue = Rare</p>
                    <p className="sr ra-text">Purple = Super Rare</p>
                    <p className="ssr-text ra-text">Golden = Super Super Rare</p>
                    <p>Higher rarity heroes are worth more time fragments than more common ones!</p>
                </div>
                {content}
            </div>
        )
    }
}