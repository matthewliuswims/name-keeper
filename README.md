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

### Manual Regression Testing Process

@TODO: need to finish this and give specific cases for the sentences below. 
@TODO: test on multiple devices

Verify that deleting all groups and all users yields proper results.
Can add multiple users to multiple groups.
Can edit users and edit groups.
Can delete users and groups.
Search Screen works as intended

 
### Outstanding Issues/Considerations
1) Need to still do my manual testing steps above
2) change package versions from latest to numbers when put in prod.
3) figure out how many places the about menu should be.
4) sentry logging?
  a) - capturing the user info <--  advanced stuff, https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
  b) 
5) fix empty top text space for long user descriptions: https://stackoverflow.com/questions/50884639/empty-text-space-in-a-continuous-text-component-react-native
6) check css things are working on android among other things (checkout evelation thing https://stackoverflow.com/questions/29323544/how-do-i-render-a-shadow)
7) setState unmounting issues
8) instead of doign poptotop use reset: https://reactnavigation.org/docs/en/stack-actions.html#reset
9) if i edit groupscreen name to be something that already exists...i need to give an err
9.5) for search screen, by default show all people?
---
9) allow user to edit they long-press (or swipe)..fotced touch on the box (gives them edit+delete) options
10) make sort icon target area bigger
11) bug: sorting (after saving a new user) <-- hard to replicate
12) move people from group to group <-- suport this.
13) bug: adding in a user which isn't the first group, only have 1 slection of the user
14) after adding a group, just take them to the group screen.
15) prepopulate edit group input
16) padding on topleft groups icon is different
17) edit instead of three colons at top right
18) asbtract styles from base.js (e.g. modalContent, modalHeader, modalMsg )
19) add proptypes
20) individual modals don't need to know their own state

### Version 2 feature requests
1) geolocation?
2) downloading all names to a file?
3) picture/thumbail?
4) delete multiple people?
5) if a user logs in again, they have the option to turn off help if they want it.
6) flashcard mode?
7) search uses fuzzy search

***avoid pronouns

'Add a group'
'Then you can add people (**or names?) to the group'


