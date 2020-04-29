import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import {Home} from "./home";
import HeaderBar from './headerbar';
import {NotFound} from "./notfound";
import {Herolist} from "./herolist";
import {Collection} from "./collection";
import {Lootbox} from "./lootbox";
import {SignUp} from "./signup";
import {Login} from "./login";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            error: null
        };
    }

    componentDidMount() {
        this.fetchAndUpdateUserInfo();

        let protocol = "ws:";
        if(window.location.protocol.toLowerCase() === "https:") {
            protocol = "wss:";
        }

        this.socket = new WebSocket(protocol + "//" + window.location.host);

        this.socket.onmessage = (event) => {
            const dto = JSON.parse(event.data);
            if(this.state.user){
                if(dto.includes(this.state.user.userId)){
                    this.notifyFreeBox();
                    this.fetchAndUpdateUserInfo();
                }
            }
        }
    }

    componentWillUnmount() {
        if(this.socket){
            if(this.state.user){
                this.socket.send(JSON.stringify({clearUserId: this.state.user.userId}));
            }
            this.socket.close();
        }
    }

    setCurrentUser = (user) => {
        this.setState({user: user});
        if(user){
            this.socket.send(JSON.stringify({userId: this.state.user.userId}));
        }
    }

    notifyFreeBox = () => {
        this.setState({error: null, freeBox: true})
        setTimeout(() => {
            this.setState({
                freeBox: false
            })
        }, 3000)
    }

    fetchAndUpdateUserInfo = async () => {
        const url = "api/user";

        let response;

        try{
            response = await fetch(url, {
                method: "GET"
            });
        } catch (e) {
            this.setState({error: "Failed to connect to server: " + e})
            return;
        }

        if(response.status === 401) {
            //Not logged in
            this.setCurrentUser(null);
            return;
        }

        if(response.status !== 200) {
            this.setState({error: "An error has occured: " + response.status})
        } else {
            const payload = await response.json();
            this.setCurrentUser(payload);
        }
    }

    render() {
        const user = this.state.user ? this.state.user : null;

        let getBox = this.state.freeBox ?
            <div className="notification">
                <p>You just received a free box!</p>
            </div>
            : null

        return (
            <div id="page-container">
                {getBox}
                <BrowserRouter>
                    <div>
                        <HeaderBar user={user} socket={this.socket} setCurrentUser={this.setCurrentUser}/>
                        <Switch>
                            <Route exact path="/" render={props =>
                                <Home
                                    {...props}
                                    user={this.state.user}/>}/>

                            <Route exact path="/heroes" render={props =>
                                <Herolist
                                    {...props}/>}/>

                            <Route exact path="/login" render={props =>
                                <Login
                                    {...props}
                                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>

                            <Route exact path="/signup" render={props =>
                                <SignUp
                                    {...props}
                                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>

                            <Route exact path="/collection" render={props =>
                                <Collection
                                    {...props}
                                    setCurrentUser={this.setCurrentUser}
                                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                                    user={user}/>}/>

                            <Route exact path="/lootbox" render={props =>
                                <Lootbox {...props}
                                    setCurrentUser={this.setCurrentUser}
                                    fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                                    user={user}/>}/>


                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));