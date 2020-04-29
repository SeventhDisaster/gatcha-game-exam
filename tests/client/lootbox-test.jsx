const React = require('react');
const { mount } = require('enzyme');
const { Lootbox } = require("../../src/client/lootbox");

const {resetAllUsers} = require("../../src/server/db/user-repo")

const {BrowserRouter
    , Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

beforeEach(() => {
    resetAllUsers();
})

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

test("Page is rendered", async () => {
    overrideFetch(app);

    await signUp("Foo", "Bar")

    const user = {userId: "Foo", lootboxes: 3, timeFragments: 300}

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const setCurrentUser = () => {};

    const driver = mount(
        <BrowserRouter>
            <Switch>
                <Lootbox
                    setCurrentUser={setCurrentUser}
                    fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}
                    user={user}
                />}/>
            </Switch>
        </BrowserRouter>
    );

    expect(driver.find("div.loot-container")).toBeDefined()
    expect(driver.find("div.loot-header")).toBeDefined()
    expect(driver.find("Link.collection-btn")).toBeDefined()
    expect(driver.find("h1.loot-title")).toBeDefined()
    expect(driver.find("p.err")).toBeDefined()
    expect(driver.find("button.purchase-box")).toBeDefined()
    expect(driver.find("p.time-fragments")).toBeDefined()
});

test("Can do purchase box", async () => {
    overrideFetch(app);

    signUp("Foo", "Bar")

    const user = {userId: "Foo", lootboxes: 3, timeFragments: 0}

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const setCurrentUser = () => {};

    const driver = mount(
        <BrowserRouter
            context={{}} location={'localhost:8080/'}>
            <Switch>
                <Lootbox
                    setCurrentUser={setCurrentUser}
                    fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}
                    user={user}
                />}/>
            </Switch>
        </BrowserRouter>
    );

    const box = driver.find(".purchase-box");



    box.simulate("click");

    const err = driver.find("p.err");
    expect(err.text()).toBeDefined();
});
