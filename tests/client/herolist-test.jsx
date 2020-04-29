const React = require('react');
const { mount } = require('enzyme');
const { Herolist } = require("../../src/client/herolist");

const {resetAllUsers} = require("../../src/server/db/user-repo")

const {MemoryRouter
    , Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

beforeEach(() => {
    resetAllUsers()
})

test("Page rendered but not hero list", async () => {
    overrideFetch(app);
    const driver = mount(
        <MemoryRouter
            context={{}} location={'localhost:8080/'}>
            <Switch>
                <Route component={ Herolist }/>
            </Switch>
        </MemoryRouter
        >
    );

    expect(driver.find("div.heroes-container")).toBeDefined()
});

test("Hero list has been rendered", async () => {
    overrideFetch(app);

    const driver = mount(
        <MemoryRouter
            context={{}} location={'localhost:8080/'}>
            <Switch>
                <Route component={ Herolist }/>
            </Switch>
        </MemoryRouter
        >
    );

    expect(driver.find("div.hero-div")).toBeDefined()
    expect(driver.find("div.hero-rarity")).toBeDefined()
    expect(driver.find("div.hero-name")).toBeDefined()
    expect(driver.find("div.series-name")).toBeDefined()
    expect(driver.find("div.series-desc")).toBeDefined()
});