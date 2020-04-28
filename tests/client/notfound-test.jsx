const React = require('react');
const { mount } = require('enzyme');
const { NotFound } = require("../../src/client/notfound");

const {StaticRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

test("404 Page is rendered", () => {
    const driver = mount(
        <StaticRouter context={{}} location={'localhost:8080/somerandompage'}>
            <NotFound/>
        </StaticRouter>
    );

    expect(driver.find("h1.notfound-h")).toBeDefined()
    expect(driver.find("p.notfound-p")).toBeDefined()
    expect(driver.find("p.notfound-text")).toBeDefined()
    expect(driver.find("Link.notfound-link")).toBeDefined()
});