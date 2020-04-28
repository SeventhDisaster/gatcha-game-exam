const React = require('react');
const { mount } = require('enzyme');
const { SignUp } = require("../../src/client/signup");

const {StaticRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

test("Sign up page is rendered", () => {
    const driver = mount(
        <StaticRouter context={{}} location={'localhost:8080/signup'}>
            <Switch>
                <Route component={SignUp}/>
            </Switch>
        </StaticRouter>
    );

    expect(driver.find("div.auth-container")).toBeDefined()
    expect(driver.find("div.auth-requirement")).toBeDefined()
    expect(driver.find("p.err")).toBeDefined()
    expect(driver.find("div.auth-form")).toBeDefined()
    expect(driver.find("input").length).toBe(3)
    expect(driver.find("button.header-button").length).toBe(1)
});

test("Can do signup", () => {
    const driver = mount(
        <SignUp/>
    );

    driver.setState({
        userId: "Foo",
        password: "ABcd1234",
        confirmPassword: "ABcd1234"
    });

    driver.find("button.header-button").simulate("click");

    expect(driver.find("p.err").text()).toBe("");
});


test("Passwords don't match", () => {
    const driver = mount(
        <SignUp/>
    );

    driver.setState({
        userId: "Foo",
        password: "ABcd1234",
        confirmPassword: "AAaa1122"
    });

    driver.find("button.header-button").simulate("click");

    expect(driver.find("p.err").text()).toBe("The passwords do not match");
});


test("Passwords does not meet criteria or unfilled", () => {
    const driver = mount(
        <SignUp/>
    );

    driver.setState({
        userId: "Foo",
        password: "Bar",
        confirmPassword: "Bar"
    });
    driver.find("button.header-button").simulate("click");
    expect(driver.find("p.err").text()).toBe("Password does not meet the criteria");

    driver.setState({
        userId: "",
        password: "",
        confirmPassword: ""
    });
    driver.find("button.header-button").simulate("click");
    expect(driver.find("p.err").text()).toBe("Please fill in the required fields");
});