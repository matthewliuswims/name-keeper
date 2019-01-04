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

4. tests are in the `__tests__` directory.  Most of the 'meaty code' is in the `src` directory. But the entry point to the App in `App.js` at the root level.


### Previous issues
0.01) add placeholder text in user screen when there are no users 'Add a person below to this group - CLICK below' also add place holder text for groups screen, explaining how app works. Something like: `Write the name of people you just met - but first, create a group!'

^^^Or have boostapped material with a 'work' group with billy joe and mary har examples <-- saying how to delete stuff
0.02) need to change groupsScreen so it comes prepopulated with a group
1) still need to fix jest..
2) increased click size - but didnt' do it for the back button
0.25) need to be able to close sort and filter modals without applying changes

### Outstanding Issues
1) test deleting groups - in a mixed up way
2) in the overflow section, have a help screen.
2) need to fix ref warnings in AddUserScreen - I just don't understand them
7) don't have to import styles if I'm not overriding anything?
8) change package versions from latest to numbers
9) design decision for groupName.. was bad
10) add text explaining what a group is to "add group screen"
11) TOOLTIPS?
12) sentry logging?
13) addgroup screen help text?
15) have about on every screen


### TODO version 2:
1) allow user to edit tags
2) allow user to add more than 2 tags
3) maybe contribute to: https://github.com/tuantle/react-native-search-header so that
onGetAutocompletions() can take in an object in addition to a string, so i can pass in 'metadata'?


