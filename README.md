## `npm start`

Runs app in development mode.

#### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests. Consult [here](https://github.com/expo/expo/tree/master/packages/jest-expo) for more info.


### Previous issues
0.01) add placeholder text in user screen when there are no users 'Add a person below to this group - CLICK below' also add place holder text for groups screen, explaining how app works. Something like: `Write the name of people you just met - but first, create a group!'

^^^Or have boostapped material with a 'work' group with billy joe and mary har examples <-- saying how to delete stuff
0.02) need to change groupsScreen so it comes prepopulated with a group
1) still need to fix jest..
2) increased click size - but didnt' do it for the back button

### Outstanding Issues
1) test deleting groups - in a mixed up way
2) in the overflow section, have a help screen.
2) need to fix ref warnings in AddUserScreen - I just don't understand them
3) what if the groupname and username are super long?
5) try a bunch of users and a bunch of groups
6) see if https://native.directory/stars/popup-menu works well
7) don't have to import styles if I'm not overriding anything?
8) change package versions from latest to numbers
9) design decision for groupName.. was bad
10) add text explaining what a group is to "add group screen"
11) TOOLTIPS?
12) sentry logging?
13) addgroup screen help text?
14) add bottom lines in the menu


### TODO version 2:
1) allow user to edit tags
2) allow user to add more than 2 tags
3) maybe contribute to: https://github.com/tuantle/react-native-search-header so that
onGetAutocompletions() can take in an object in addition to a string, so i can pass in 'metadata'?