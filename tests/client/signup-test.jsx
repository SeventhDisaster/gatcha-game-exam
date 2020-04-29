import {ReactWrapper} from "enzyme";

const React = require('react');
const { mount } = require('enzyme');
const { SignUp } = require("../../src/client/signup");

const {MemoryRouter, Switch, Route} = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

test("Sign up page is rendered", () => {
    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080/signup'}>
            <Switch>
                <Route component={SignUp}/>
            </Switch>
        </MemoryRouter>
    );

    expect(driver.find("div.auth-container")).toBeDefined()
    expect(driver.find("div.auth-requirement")).toBeDefined()
    expect(driver.find("p.err")).toBeDefined()
    expect(driver.find("div.auth-form")).toBeDefined()
    expect(driver.find("input").length).toBe(3)
    expect(driver.find("button.header-button").length).toBe(1)
});

test("Can run do signup", async () => {
    overrideFetch(app)

    const driver = mount(
        <SignUp/>
    );

    driver.setState({
        userId: "Foo",
        password: "ABcd1234",
        confirmPassword: "ABcd1234"
    });

    //This click attempts a sign-in, and redirects out. So the react wrapper should be empty
    driver.find("button.header-button").simulate("click");

    //Due to redirect this page is now gone
    expect(driver.find("p.err").length).toBe(0);
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