const React = require('react');
const { mount } = require('enzyme');
const { HeaderBar } = require("../../src/client/headerbar");

const {StaticRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

test("Test rendered header when not logged in", () => {
    const driver = mount(
        <StaticRouter context={{}} location={'localhost:8080'}>
            <HeaderBar/>
        </StaticRouter>
    );
    expect(driver.find("Link.header-button").at(0).text()).toBe("Login");
    expect(driver.find("Link.header-button").at(1).text()).toBe("Sign Up");
    expect(driver.find("Link.header-button").length).toBe(2);
})

test("Test rendered header when logged in", async () => {
    overrideFetch(app);

    const user = {userId: "Foo"}

    const driver = mount(
        <StaticRouter context={{}} location={'localhost:8080'}>
            <HeaderBar userId={user.userId}/>}/>
        </StaticRouter>
    );

    expect(driver.find(".header-button").text()).toBe("Logout")
})