const React = require('react');
const { mount } = require('enzyme');
const { Login } = require("../../src/client/login");

const { resetAllUsers } = require("../../src/server/db/user-repo")

const {MemoryRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

beforeEach(() => {
    resetAllUsers();
})

function isErrorDisplayed(driver){
    return driver.find("p.err").text() === "Invalid username / password"
}

async function waitForIsErrorDisplayed(driver) {
    return await asyncCheckCondition(() => {
        driver.update();
        return isErrorDisplayed(driver);
    }, 2000, 200)
}

test("Login page is rendered", async () => {
    overrideFetch(app)

    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080/login'}>
            <Switch>
                <Route component={Login}/>
            </Switch>
        </MemoryRouter>
    );

    expect(driver.find("div.auth-container")).toBeDefined()
    expect(driver.find("div.auth-requirement")).toBeDefined()
    expect(driver.find("p.err")).toBeDefined()
    expect(driver.find("div.auth-form")).toBeDefined()
    expect(driver.find("input").length).toBe(2)
    expect(driver.find("button.header-button").length).toBe(1)
});

test("Attempt invalid username or password", async () => {
    overrideFetch(app)

    const driver = mount(
        <Login/>
    );

    driver.setState({
        userId: "Foo",
        password: "ABcd1234",
    });

    driver.find("button.header-button").simulate("click");

    const displayed = await waitForIsErrorDisplayed(driver)
    expect(displayed).toEqual(true);
});