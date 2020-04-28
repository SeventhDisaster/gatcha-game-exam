import React from "react";
import {Link} from "react-router-dom";

export class Home extends React.Component{
    constructor(props){
        super(props);
    }


    //TODO: Implement WS counter for lootboxes
    getUserSection = (user) => {
        console.log(user);
        return (
            <React.Fragment>
                <div>
                    <h3>Welcome to Hiiro {user.userId}</h3>
                    <p>You currently have {user.lootboxes} lootboxes to open!</p>
                </div>
                <div>
                    <Link className="header-button openloot-btn" to={"/lootbox"}>Lootboxes</Link>
                    <Link className="header-button collection-btn" to="/collection">Your Collection</Link>
                </div>

            </React.Fragment>
        )
    }

    render() {
        let userContent;
        let user = this.props.user;
        if(user){
           userContent = this.getUserSection(user);
        } else {
            userContent =
                <div className="unlogged">
                    Please login to play
                </div>
        }

        return (
            <div className="home-container">
                <div className="home-header">
                    <h1 className="home-title"> - Hiiro -</h1>
                    <p className="home-description">Collect heroes and protagonists from a collection of well known Japanese animation series!</p>
                    <p className="home-description">Spend time fragments to purchase loot boxes to collect more heroes!</p>
                    <Link className="header-button" to="/heroes" tabIndex="0">See all the heroes</Link>
                </div>
                {userContent}
            </div>
        )
    }
}