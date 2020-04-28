import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import {Home} from "./home";
import {HeaderBar} from './headerbar';
import {NotFound} from "./notfound";
import {SignUp} from "./signup";
import {Login} from "./login";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div id="page-container">
                <BrowserRouter>
                    <HeaderBar />
                    <Switch>
                        <Route exact path="/login" render={props => <Login {...props} />}/>
                        <Route exact path="/signup" render={props => <SignUp {...props} />}/>
                        <Route exact path="/" render={props => <Home {...props} />}/>
                        <Route component={NotFound}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));