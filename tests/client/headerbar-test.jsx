const React = require('react');
const { mount } = require('enzyme');
const {HeaderBar} = require("../../src/client/headerbar");

const { MemoryRouter } = require("react-router-dom");
const app = require("../../src/server/app");
const { overrideFetch, asyncCheckCondition } = require('../test-utils');

function isLoggedOutDisplayed(driver){
    const loginbtn = driver.find("Link.header-button").at(0);
    const signUpBtn = driver.find("Link.header-button").at(1);

    return (loginbtn || signUpBtn)
}

async function waitForIsLoggedOutDisplayed(driver) {
    return await asyncCheckCondition(() => {
        driver.update();
        return isLoggedOutDisplayed(driver);
    }, 2000, 200)
}

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

test("Test rendered header when not logged in", () => {
    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080'}>
            <HeaderBar user={null}/>
        </MemoryRouter>
    );
    expect(driver.find("Link.header-button").at(0).text()).toBe("Login");
    expect(driver.find("Link.header-button").at(1).text()).toBe("Sign Up");
    expect(driver.find("Link.header-button").length).toBe(2);
})

test("Test rendered header when logged in", async () => {
    overrideFetch(app);

    const user = {userId: "Foo", password: "Bar"}

    await signUp(user.userId, user.password);

    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080'}>
            <HeaderBar user={user}/>}/>
        </MemoryRouter>
    );

    expect(driver.find(".header-button").text()).toBe("Logout");
})

test("Test do logout button", async () => {
    overrideFetch(app);

    const user = {userId: "Foo", password: "Bar"}

    await signUp(user.userId, user.password);

    const driver = mount(
        <MemoryRouter context={{}} location={'localhost:8080'}>
            <HeaderBar user={user}/>}/>
        </MemoryRouter>
    );

    expect(driver.find(".header-button").text()).toBe("Logout");

    driver.find(".header-button").simulate('click');

    const displayed = await waitForIsLoggedOutDisplayed(driver);
    expect(displayed).toEqual(true)

})