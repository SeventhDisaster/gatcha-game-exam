const React = require('react');
const { mount } = require('enzyme');
const { Collection } = require("../../src/client/collection");

const { getUser , resetAllUsers} = require("../../src/server/db/user-repo")

const {MemoryRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

beforeEach(() => {
    resetAllUsers();
})

async function signUp(userId, password) {
    const response = await fetch('/api/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userId, password: password})
    });

    return response.status === 201;
}

async function openBoxes() {
    const response = await fetch("/api/openbox", { method: "POST"});
    return response.status === 200;
}

function isCollectionDisplayed(driver){
    const heroDiv = driver.find(".hero-div");
    const nameDiv = driver.find(".hero-name");
    const seriesDiv = driver.find(".series-name");
    const descDiv = driver.find(".hero-desc");

    return (heroDiv && nameDiv && seriesDiv && descDiv )
}

async function waitForCollectionDisplayed(driver) {
    return await asyncCheckCondition(() => {
        driver.update();
        return isCollectionDisplayed(driver);
    }, 5000, 200)
}

test("Page rendered but not collection", async () => {
    overrideFetch(app);

    const user = {userId: "Foo", password: "Bar"}

    expect(await signUp(user.userId, user.password)).toBe(true);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080/'}>
            <Switch>
                <Route render={props =>
                    <Collection
                        {...props}
                        fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>}/>/>
            </Switch>
        </MemoryRouter>
    );

    expect(driver.find("div.collection-container")).toBeDefined()
    expect(driver.find("div.collection-header")).toBeDefined()
    expect(driver.find("h1.collection-title")).toBeDefined()
});

test("Can display collection of user", async () => {
    overrideFetch(app);

    const signedUp = await signUp("Foo", "Bar")
    expect(signedUp).toBe(true);

    const gotRewards = await openBoxes();
    expect(gotRewards).toBe(true);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080/collection'}>
            <Switch>
                <Route render={props =>
                    <Collection
                        {...props}
                        fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>}/>/>
            </Switch>
        </MemoryRouter>
    );

    expect(driver.find("div.collection-container")).toBeDefined()
    expect(driver.find("div.collection-header")).toBeDefined()
    expect(driver.find("h1.collection-title")).toBeDefined()

    const displayed = await waitForCollectionDisplayed(driver);
    expect(displayed).toEqual(true);
});