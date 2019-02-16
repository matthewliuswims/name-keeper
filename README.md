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
3) sentry logging?
  a) - capturing the user info <--  advanced stuff, https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
4) fix empty top text space for long user descriptions: https://stackoverflow.com/questions/50884639/empty-text-space-in-a-continuous-text-component-react-native
5) check css things are working on android among other things (checkout evelation thing https://stackoverflow.com/questions/29323544/how-do-i-render-a-shadow)
6) setState unmounting issues
7) https://docs.expo.io/versions/latest/guides/splash-screens/
8) https://facebook.github.io/react-native/docs/activityindicator
9) add circular icons to the group iin the groups screen
---
11) bug: sorting (after saving a new user) <-- hard to replicate


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


