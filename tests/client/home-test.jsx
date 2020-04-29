const React = require('react');
const { mount } = require('enzyme');
const { Home } = require("../../src/client/home");

const { resetAllUsers } = require("../../src/server/db/user-repo")

const {BrowserRouter
    , Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch } = require('../test-utils');

beforeEach(() => {
    resetAllUsers();
});


async function signUp(userId, password) {
    const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId, password: password })
    });

    return response.status === 201;
}

test("Home page is rendered when logged out", () => {
    const driver = mount(
        <BrowserRouter
            context={{}} location={'localhost:8080/'}>
            <Switch>
                <Route component={Home}/>
            </Switch>
        </BrowserRouter>
    );

    expect(driver.find("div.home-container")).toBeDefined()
});

test("Home page is rendered when logged in", async () => {
    overrideFetch(app);

    const signedup = await signUp("foo", "bar");
    expect(signedup).toEqual(true);

    const driver = mount(
        <BrowserRouter
            context={{}} location={'localhost:8080/'}>
            <Switch>
                <Route component={Home}/>
            </Switch>
        </BrowserRouter>
    );

    expect(driver.find("div.home-container")).toBeDefined()
    expect(driver.find("div.user-section-header")).toBeDefined()
    expect(driver.find("div.user-section-welcome")).toBeDefined()
    expect(driver.find("div.user-section-lootboxes")).toBeDefined()
    expect(driver.find("Link.openloot-btn")).toBeDefined();
    expect(driver.find("Link.collection-btn")).toBeDefined();
});
