PG6301 exam at Kristiania University College (Høyskolen Kristiania) - 48 Hour Exam

Application theme: Gatcha Game

Application name: Hiiro
### Test user: `Weeb - Anime123`
Test user starts with 3 heroes in collection, some time fragments to begin with, and 2 more lootboxes than new users have.
Login with username Weeb and Password Anime123

### Runs on: `http://localhost:8080`
This application has NOT been published on any cloud providers.

#### The following commands are avaiable to run from CLI:
* `yarn test` - Runs tests with coverage
* `yarn dev` - Concurrently starts and watches server and watches client files
* `yarn watch:client` - Runs client for development
* `yarn watch:server` - Utilizes nodemon, runs server.js, watches server and public files
* `yarn build` - Builds project for production (Refreshes content of public folder)
* `yarn start` - Starts the server with NodeJS

#### Start the application
1. unzip project files in a single directory, and navigate into it in CLI
2. Run command: `yarn install`
    * This sets up node dependencies from package.json
3. Run tests with `yarn test` or start the application with `yarn dev`
    * NOTE: Make sure port 8080 is not already in use by some other program
    * After starting yarn dev, open a browser and go to `http://localhost:8080` in the URL

## Intro
I found this exam to be very challenging in a good way. I didn't expect to end up completing as much as I did.

The application I created is a gacha game where the collectibles are protagonists from various Japanese animations series
and cartoons.
I do not take any credit for the sample characters I have used inside of the database. `/src/server/db/heroes-repo.js`

The entire project has been build from scratch using the following libraries:

* React for the client framework and components
* Node.JS, Express and Express Websockets for server runtime
* Passport was used for Authentication
* Babel, and Webpack for translating between jsx/js and bundling the front-end
* Jest and Enzyme were used for testing

Not all code in this repository is written by me. 
Certain parts of code are directly copy-pasted from course-lectures.
These parts have been marked with comments in the relevant areas.

NOTE: I did not mark code that I wrote myself that just looks similar in structure to some class code. 
This is a side effect of getting used to writing in a similar way.

### Structure
Every requirement besides possibly the amount of extra features and 70% test coverage should have been met if I did not
miss something.

Security should be maintained as users have minimal access to their own data, and most handling of their information
is done on the server side. The values users recieve in the front-end for their amount of Lootboxes and Time-Fragments, 
is just a representation of what they actually have in the backend. If they try to edit it in the front-end, the
back-end should not accept it. This should prevent cheating.

The websocket backend for delivering timed lootbox drops is kind of a weird workaround.
I was not sure how to make websocket only call specific users after they logged in, so instead I implemented a
system where every 60 seconds (as long as any user is logged in), all logged in users will receive a lootbox.
Data received from the server is only the notification that a loot-box was given.
Actual distribution of boxes is handled in back end.

Public files are found here:
`public/`

Client files can be found under:
`src/client`

Server memory-data storage can be found here:
`src/server/db`

Server endpoints (except Websocket) are found here:
`src/server/routes`

All tests are structured the same way as the client/server files under `/tests`

## Requirements:
#### Application Topic Requirements:

**T1:** Home page does not display anything, but by logging in with provided account (or signing up with a new account)
You will be able to visit your own collection area and see predefined data in there. Due to the nature of the application I thought
it best to put such data in a separate place from home screen.

**T2:** By pressing the first button on the home page "See all the heroes", any user, regardless if logged in or not, will be able
to enter that component and see a full list of all the heroes, displayed by an api call as a get request towards `/api/heroes`

**T3:** Like mentioned in T1, after logging in; a button that says "Your Collection" will take you to your logged-in user's collection
of heroes for the gacha game. For the test user, this is filled with a few sample heroes. For a new user, it is empty.

**T4:** Any account that is created is given the basic setup of the following:
* 3 Loot boxes
* 0 Heroes in collection
* 0 Time Fragments (the in game currency)

A page that can be accessed from the front page of the application (or from your collection) called "Lootboxes", allows the user to redeem
their own set of lootboxes.
Every lootbox will reward the player with a set of 3 heroes from the heroes list, and can include duplicates.
These rewards are added to the user's collection and can be viewed in the "Collection" page accessed from home or lootboxes.

Inside of "Collection" page, users can see what heroes they are missing from the full list, as well as look at their full collection
Instead of telling the user the amount of dupes, I simply chose to display it directly in the collection.

**T5**: When in the collection page, as long as the user has any units in their collection, there will be displayed a "Sell" 
button on every one of the items displayed. Simply pressing this button will remove the hero and return the player the 
equivilent value of the sold hero. This currency can be used at the lootbox page to buy more lootboxes.

**T6:** Currently, every minute a global timer is set to broadcast one extra lootbox to every client that is currently logged in.
This is done with websocket connections. The distribution is handled server-side, so as to avoid abusing the system by opening
multiple tabs.


#### Code Requirements:
**R1:** 
* Home page is created with React
* 3 other pages can be accessed using React-Router (Herolist, Collection, Lootbox) not counting login/signup
* Every page (besides 404) has states that affect their rendering.
* By pressing the "Hiiro" logo in the top left of the page, you can *always* return to front page

**R2:**
* GET:
    * `/api/heroes` - Return full list of heroes in game
    * `/api/user` - Return your user info (id, lootbox count, time fragments)
* POST: 
    * `/api/openbox` - Consumes a lootbox
    * `/api/lootboxes` - Purchases a lootbox
    * `/api/collection` - Return your own user's collection of heroes
    * `/api/signup` - Signup
    * `/api/login` - Login
    * `/api/logout` - Logout
* PUT:
    * `/api/heroes` Create new heroes - _This is not used in frontend_
* DELETE:
    * `/api/collection` - Selling heroes in your collection
    * `/api/user` - Deleting user - _Not used in frontend_
    
I decided to use the delete method for that as it seemed fitting for removing a hero from your list.

The front end does make use of fetch quite a lot.

**R3:**
Authentication via cookies has been implemented. A page is provided for both login and signup, which the users can always access from 
the header bar at the top of the page.

**R4:**
Authentication and "Authorization" checks are implemented into the backend. Authorization in this context usually entails
doing an action you can't do, such as trying to open a box when you are out of boxes.
These tests can be found in security-test.js

**R5:**
* Heroes and rewards have different rarities attached to them. Making some more common than other. 
    Higher rarities have higher sell prices.
* Amount of lootboxes in possesion is displayed on the home page
* User collection is sorted by hero name alphabetically
* Signup has password security features in place (Though only on front-end);

#### Testing
As of 12:05 AM Thursday 30/4/2020 (Right after midnight 29/4/2020)
I have achieved a total of 61.59% all file %Stmts coverage as shown in the image below:
![Yarn Test Results](https://i.imgur.com/Jxyfh8u.png)

Unfortunately, I was not able to make it up to above 70% coverage.
I discovered during the last 24 hours of the exam that I had an issue with rendering state changes in the front
end tests.
So much so that in pretty much any client-side code, I was unable to test for changes in the driver, as I could never
figure out why I could not get any drivers to update.

`lootbox.jsx` and `collection.jsx` are by far the largest client side files. And they rely heavily on state changes, updates
and functions passed into them as props for their rendering on top of requiring authentication to be rendered in the first place.
Unfortunately due to the unresolved problems I faced with mounted components not updating in the tests, I was unable to run most of the functions
present in these two files in particular.

My tests should not fail, as they seem to pass consistently at least in my attempts, and the lines that do have been covered have been ran, but the potential for more coverage lies 
behind some bug somewhere that prevents my drivers from updating despite cross-referencing my own test cases in other projects
where it worked fine.

Server side testing was not a problem, most of server side code has been properly tested and sometimes even executed multiple
 times over.
 
 ## Missing features and potential improvements
 #### Missing Features
 I think I managed to cover every necessary feature in production. However, I did not manage to create the tests necessary to cover everything.
 
 #### Future Improvement Ideas
 Here are a few things I considered adding to the program that I ended up leaving out due to the time constraints:
 * Make use of the collectibles in more ways: Such as getting in-depth information about them, or playing games with them, similar to real gatcha games
 * Different kinds of lootboxes (some with higher chances of better value heroes)
 
 ### Self evaluation:
 In the end, I think I put in the best effort I could. I was surpised at how fast I managed to create the general functionality of
 the project itself. I am personally pretty bummed that I didn't manage to resolve the issues I had with client side tests in time,
 but this at least taught me to prioritize testing more in future projects.
 I'm proud of what I managed to do within these two days, and although I tried my hardest to grab an A, I think due to the issues
 with client side tests I only deserve a **B** for these results.
