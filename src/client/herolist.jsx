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

    parseRarity(rarityValue) {
        switch (rarityValue) {
            case 1: return "R"; //Rare
            case 2: return "SR"; //Super Rare
            case 3: return "SSR"; //Super Super Rare
            default: return "Error" //Should not happen
        }
    }

    createHeroList(heroes){
        return(
            <div>
                {heroes.map(hero => (
                    <React.Fragment key={hero.name}>
                        <div className="hero-div">
                            <h4 className="hero-name">{hero.name} - {this.parseRarity(hero.rarity)}</h4>
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
            <div className="heroes-container">
                <h1>Hero List Page</h1>
                {content}
            </div>
        )
    }
}