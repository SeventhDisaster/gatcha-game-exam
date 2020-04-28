import React from "react";
import {Link} from "react-router-dom";

export class Home extends React.Component{
    constructor(props){
        super(props);
    }


    getUserSection = (user) => {
        return (
            <React.Fragment>
                <h3>Welcome to Hiiro {user.userId}</h3>
                <Link className="header-button" to="/collection">Your Collection</Link>
            </React.Fragment>
        )
    }

    render() {
        let userContent;
        let user = this.props.user;
        if(user){
           userContent = this.getUserSection(user);
        }

        return (
            <div className="home-container">
                <div className="home-header">
                    <h1 className="home-title"> - Hiiro -</h1>
                    <p className="home-description">Collect heroes and protagonists from a collection of well known Japanese animation series!</p>
                    <p className="home-description">Spend time fragments to purchase loot boxes to collect more heroes!</p>
                </div>
                {userContent}
                <Link className="header-button" to="/heroes" tabIndex="0">See all the heroes</Link>
            </div>
        )
    }
}