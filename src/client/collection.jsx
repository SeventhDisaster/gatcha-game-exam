import React from "react";
import {Link} from "react-router-dom";

export class Collection extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            collection: [],
            missing: [],
            error: null
        }
    }

    componentDidMount() {
        this.fetchUserCollection();
        this.displayMissing();
        this.props.fetchAndUpdateUserInfo();
    }

    displayMissing = async () => {
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
        const result = JSON.parse(payload)

        let allHeroes = [];

        for(let hero of result){
            allHeroes.push(hero.name);
        }

        const filterMissing = (hero) => {
            for(let collected of this.state.collection){
                if(hero === collected.name){
                    return false;
                }
            }
            return true;
        }


        const missing = allHeroes.filter(filterMissing);
        this.setState({missing: missing})
    }


    fetchUserCollection = async () => {
        const url = "/api/collection"

        let response;

        try {
            response = await fetch(url, {
                method: "POST"})
        } catch (e) {
            this.setState({error: "Failed to connect to server: " + e})
        }

        if (response.status === 401) {
            this.props.setCurrentUser(null);
            this.props.history.push("/");
            return;
        }

        if (response.status !== 200) {
            this.setState({
                errorMsg: "Failed connection to server. Status " + response.status
            });
            return;
        }

        const payload =  JSON.parse(await response.json());

        this.setState({error: null, collection: payload})
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

    sortHeroes = (a, b) =>{
        if(a.name > b.name) return 1;
        if(b.name > a.name) return -1;
    }

    //Sell hero for Time fragments
    doMillHero = async (heroIndex) =>{
        const url = "/api/collection"

        let response;

        try {
            response = await fetch(url, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({heroIndex: heroIndex})
            })
        } catch (e) {
            this.setState({error: "Failed to connect to server: " + e})
        }

        if (response.status === 401) {
            this.props.setCurrentUser(null);
            this.props.history.push("/");
            return;
        }

        if (response.status === 500) {
            this.setState({
                errorMsg: "Something went wrong in the backend. Status " + response.status
            });
            return;
        }

        if (response.status !== 204) {
            this.setState({
                errorMsg: "Failed connection to server. Status " + response.status
            });
            return;
        }

        this.setState({error: null});

        this.fetchUserCollection();
        this.displayMissing();
        this.props.fetchAndUpdateUserInfo();
    }

    //Sell button
    millDiv = (index, rarity) => {
        let value;

        switch (rarity) {
            case 1: value = 100; break;
            case 2: value = 200; break;
            case 3: value = 300; break;
        }
        return (
            <button className="mill-btn" onClick={() => this.doMillHero(index)}>Sell - {value}♦</button>
        )
    }

    createCollectionDiv(heroes){
        if(heroes.length < 1) {
            return (
                <div>
                    <p className="empty-coll">Seems like your collection is empty!</p>
                    <p className="empty-coll">Go to the lootbox to start collecting!</p>
                </div>
            )
        } else {
           return(

                <div className="collection-display">
                    {heroes.sort(this.sortHeroes).map(hero => (
                        //Hero index is used as a key. Represents it's index in
                        <React.Fragment key={hero.index}>
                            <div className={this.colorRarity(hero.rarity)}>
                                <h4 className="hero-name">{hero.name} - {this.parseRarity(hero.rarity)}</h4>
                                <p className="series-name">Series: {hero.series}</p>
                                <p className="hero-desc">{hero.description}</p>
                                {this.millDiv(hero.index, hero.rarity)}
                            </div>
                        </React.Fragment>))
                    }
                </div>
            )
        }
    }

    render() {
        let timeFragments;
        if(this.props.user){
            timeFragments = this.props.user.timeFragments;
        }

        let userCollection;

        if(this.props.user){
            userCollection = this.createCollectionDiv(this.state.collection);
        }

        let missing;

        if(this.state.missing.length > 0){
            missing = this.state.missing.join(", ")
        } else {
            missing = "None! You got them all!"
        }

        return (
            <div className="loot-container">
                <div className="loot-header">
                    <p className="time-fragments">Time Fragments: {timeFragments}♦</p>
                    <Link className={"header-button"} to={"/lootbox"}>Lootboxes</Link>
                    <h1 className="loot-title">Your Collection:</h1>
                    {userCollection}
                    <h3>You are missing the following heroes:</h3>
                    <p>{missing}</p>
                </div>
            </div>
        )
    }
}