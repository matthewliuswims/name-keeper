# Remember names

How often do you remember someone's face, but not their name? This is a native app for iOS and android that offers a solution.

## Installation

1. have expo cli installed: [click here](https://docs.expo.io/versions/v31.0.0/introduction/installation)

2. `npm i` in the app's root directory

3. `npm start` to see the app in development mode. 

## App architecture

1. Built in react-native using the expo SDK. 

2. Jest is used as the testing framework.

3. Notable libraries: redux is used extensively for state management, while react-navigation is used for navigating between screens.

4. tests are in the `__tests__` directory.  Most of the 'meaty code' is in the `src` directory. But the entry point to the App is `App.js` at the root directory.

### User Testing
Scenario: imagine you are a church pastor, and you meet 5 new people that day (I will give photos) and
give explanations for each person. It is your job as the pastor to try to remember their name.

A week later, before church, you think you might see the people again, so you pull out your phone
and refresh your memory.

### Manual Regression Testing Process

Do this for both ios and android
0) Go to the users screen <-- verify there is no way to create a group in that state.
1) go back to the groups screen & add a group and add a user. Make sure you can search+click for the user in that group.
2) go back to the users screen and make sure sort + filter are working
2.5) then go back to the group
3) add 2 more users in the group --> make sure sort is working.
4) add 2 more groups, and in the 3rd group add 1 user.
5) search for the lastest user in the first group -> there should be no result
6) search+click for the lastest user the groups screen. This should work
7) delete the first group and verify its users are gone
8) create 2 more groups
    a) first group, put a VERY Long name with '1 normal user'
    b) second group, have a normal name, but 3 users:
        - 1 user with a very long name descriptionand location
        - 1 user with a very long name
        - 1 user with a very long desription 
    c) in the second group, add enough users so it scrolls <-- ensure things look as expected
9) verify searching for a user in a users screen with scrolling doesn't break stuff
9.5) do sort and filter in the users screen
10) create more groups till it scrolls.
11) delete 2 users
12) delete all groups

 
### Outstanding Issues/Considerations
1) Need to still do my manual testing steps above
2) change package versions from latest to numbers when put in prod.
3) sentry logging?
  a) - capturing the user info <--  advanced stuff, https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
4) fix empty top text space for long user descriptions: https://stackoverflow.com/questions/50884639/empty-text-space-in-a-continuous-text-component-react-native
5) check css things are working on android among other things (checkout evelation thing https://stackoverflow.com/questions/29323544/how-do-i-render-a-shadow)

14) remove console log statements or put them into sentry? especailly the redux? or is that too much


### Version 2 feature requests
1) geolocation?
2) downloading all names to a file?
3) picture/thumbail?
4) delete multiple people?
5) if a user logs in again, they have the option to turn off help if they want it.
6) flashcard mode?
7) search uses fuzzy search
8) allow user to edit they long-press (or swipe)..fotced touch on the box (gives them edit+delete) options

***avoid pronouns

'Add a group'
'Then you can add people (**or names?) to the group'


