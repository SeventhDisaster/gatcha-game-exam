const React = require('react');
const { mount } = require('enzyme');
const { Login } = require("../../src/client/login");

const {StaticRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

test("Login page is rendered", () => {
    const driver = mount(
        <StaticRouter context={{}} location={'localhost:8080/login'}>
            <Switch>
                <Route component={Login}/>
            </Switch>
        </StaticRouter>
    );

    expect(driver.find("div.auth-container")).toBeDefined()
    expect(driver.find("div.auth-requirement")).toBeDefined()
    expect(driver.find("p.err")).toBeDefined()
    expect(driver.find("div.auth-form")).toBeDefined()
    expect(driver.find("input").length).toBe(2)
    expect(driver.find("button.header-button").length).toBe(1)
});