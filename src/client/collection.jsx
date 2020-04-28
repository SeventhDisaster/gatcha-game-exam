import React from "react";

export class Collection extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            collection: [],
            error: null
        }
    }

    componentDidMount() {
        this.fetchUserCollection(this.props.user);
    }

    fetchUserCollection = async (userId) => {
        const url = "/api/collection"

        let response;

        try {
            response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userId: userId})
            })
        } catch (e) {
            this.setState({error: "Failed to connect to server: " + error})
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

    sortHeroes = (a, b) =>{
        if(a.name > b.name) return 1;
        if(b.name > a.name) return -1;
    }

    createCollectionDiv(heroes){
        if(heroes.length < 1) {
            return (
                <p>Seems like your collection is empty!</p>
            )
        } else {
           return(

                <div>
                    {heroes.sort(this.sortHeroes).map(hero => (
                        //Hero index is used as a key. Represents it's index in
                        <React.Fragment key={hero.name + hero.index}>
                            <div className="hero-div">
                                <h4 className="hero-name">{hero.name} - {this.parseRarity(hero.rarity)}</h4>
                                <p className="series-name">Series: {hero.series}</p>
                                <p className="hero-desc">{hero.description}</p>
                            </div>
                        </React.Fragment>))
                    }
                </div>
            )
        }
    }

    render() {
        let userCollection;

        if(this.props.user){
            userCollection = this.createCollectionDiv(this.state.collection);
        }

        return (
            <div className="collection-container">
                <div className="collection-header">
                    <h1 className="collection-title">Your Collection:</h1>
                    {userCollection}
                </div>
            </div>
        )
    }
}