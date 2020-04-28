import React from "react";
import {Link} from "react-router-dom";

export class Lootbox extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            rewards: null,
            error: null
        }
    }

    componentDidMount() {
        this.props.fetchAndUpdateUserInfo();
    }

    doPurchaseBox = async () => {
        const url = "/api/lootboxes"

        let response;

        try{
            response = await fetch(url, {
                method: "POST"
            })
        } catch (e) {
            this.setState({error: "Failed to connect to server: " + error})
        }

        if (response.status === 401) {
            this.props.setCurrentUser(null);
            this.props.history.push("/");
            return;
        }

        if (response.status === 403) {
            this.setState({error: "Not enough time fragments to purchase!"});
            return;
        }

        this.setState({error: null})

        this.props.fetchAndUpdateUserInfo();
    }

    doOpenBox = async () => {
        const url = "/api/openbox"

        let response;

        try {
            response = await fetch(url, {
                method: "POST"})
        } catch (e) {
            this.setState({error: "Failed to connect to server: " + error})
        }

        switch (response.status) {
            case 400:
                this.setState({error: "You have no boxes left to open"})
                return;
            case 401:
                this.props.setCurrentUser(null);
                this.props.history.push("/");
                return;
        }

        if(response.status !== 200) {
            this.setState({
                errorMsg: "Failed connection to server. Status " + response.status
            });
            return;
        }

        //This payload contains the rewards for opening
        const payload = JSON.parse(await response.json());

        this.setState({rewards: payload, error: null});

        this.props.fetchAndUpdateUserInfo();
    }

    prepareNext = () => {
        this.setState({rewards: null})
    }

    displayRewards(){
        const first = this.state.rewards[0];
        const second = this.state.rewards[1];
        const third = this.state.rewards[2];

        return(
            <div>
                <React.Fragment>
                    <div className="reward-display">
                        <div className="reward">
                            <h4>{first.name}</h4>
                            <p>{first.series}</p>
                            <p>{first.description}</p>
                        </div>
                        <div className="reward">
                            <h4>{second.name}</h4>
                            <p>{second.series}</p>
                            <p>{second.description}</p>
                        </div>
                        <div className="reward">
                            <h4>{third.name}</h4>
                            <p>{third.series}</p>
                            <p>{third.description}</p>
                        </div>
                    </div>
                    <button onClick={this.prepareNext}>Open another</button>
                </React.Fragment>
            </div>
        )
    };

    displayBox(){
        let boxAvailable = false;

        if(this.props.user.lootboxes > 0) {
            boxAvailable = true
        }


        return(
            <React.Fragment>
                <button className="box"
                        onClick={this.doOpenBox}
                        style={{opacity: boxAvailable ? 1 : .3, clickEvents : boxAvailable ? "auto" : "none"}}>
                    Open Box!
                </button>
            </React.Fragment>
        )
    };

    render() {

        //If user isn't logged in, redirect back to home
        if(!this.props.user){
            this.props.history.push("/");
            return <></>;
        }

        let content;
        if(this.state.rewards){
            content = this.displayRewards();
        } else {
            content = this.displayBox();
        }

        let error = "";
        if(this.state.error){
            error = this.state.error
        }

        return (
            <div className="loot-container">
                <div className="loot-header">
                    <Link className="header-button collection-btn" to="/collection">Your Collection</Link>
                    <h1 className="loot-title">Get your heroes!</h1>
                    <p className="err">{error}</p>
                    <p>You currently have {this.props.user.lootboxes} lootboxes!</p>

                    <p>You can purchase more lootboxes with time fragments</p>
                    <p>Time Fragments: {this.props.user.timeFragments}</p>
                    <button onClick={this.doPurchaseBox}>Purchase Box | TF 100,-</button>
                </div>
                <div className="box-reward">
                    {content}
                </div>
            </div>
        )
    }
}