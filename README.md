# Name Keeper
How often do you remember someone's face, but not their name? This is an app that stores the names + descriptions of the people you meet within your social groups. 

## Installation

1. have expo cli installed: [click here](https://docs.expo.io/versions/latest/)

2. `npm i` in the app's root directory

3. `npm start` to see the app in development mode. 

## App architecture

1. Built in react-native using the expo SDK. 

2. Jest is used as the testing framework.

3. Notable libraries: redux is used extensively for state management, while react-navigation is used for navigating between screens.

4. tests are in the `__tests__` directory.  Most of the 'meaty code' is in the `src` directory. But the entry point to the App is `App.js` at the root directory.


### TODO:

0. FAQ add?
1. app descrpition
    * don't say app
    * don't have to preface quote
    * please let me know what you experience:
5. General group <-- boostrapped group. Or be able to create a group on the fly...just have "add group" in the seleeciton.
6. list styleof description. 
8. this process cannot be undone.

### Manual Regression Testing Process

Do this for both ios and android

0. Go to the users screen <-- verify there is no way to create a group in that state.
1. go back to the groups screen & add a group and add a user. Make sure you can search+click for the user in that group.
2. go back to the users screen and make sure sort + filter are working then go back to the group
4. add 2 more users in the group --> make sure sort is working.
5. add 2 more groups, and in the 3rd group add 1 user.
6. search for the lastest user in the first group -> there should be no result
7. search+click for the lastest user the groups screen. This should work
8. delete the first group and verify its users are gone
9. create 2 more groups
    * first group, put a VERY Long name with '1 normal user'
    * second group, have a normal name, but 3 users:
        - 1 user with a very long name descriptionand location
        - 1 user with a very long name
        - 1 user with a very long desription 
    * in the second group, add enough users so it scrolls <-- ensure things look as expected
10. verify searching for a user in a users screen with scrolling doesn't break stuff
11. do sort and filter in the users screen
12. create more groups till it scrolls.
13. delete 2 users
14. delete all groups


### Version 2 feature requests
1. geolocation?
2. downloading all names to a file?
3. picture/thumbail?
4. have addable descriptors rather than a description <-- reilly's suggestion
5. bulk edit

### Additional Contributors

User Testing + UI/UX Critique:
  
* Susan Michalski
* Sam Rose
* Joshua Montgomery
* Karissa Jobman
* Relly Jorgenson

App Architecture Advising: 

* Adrian Cruz

# License
MIT
