const React = require('react');
const { mount } = require('enzyme');
const { Home } = require("../../src/client/home");

const {StaticRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

test("Home page is rendered", () => {
    const driver = mount(
        <StaticRouter context={{}} location={'localhost:8080/'}>
            <Switch>
                <Route component={Home}/>
            </Switch>
        </StaticRouter>
    );

    expect(driver.find("div.home-container")).toBeDefined()
});