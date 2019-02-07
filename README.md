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


### Outstanding Issues/Considerations
0.5) change add group to match snapchat login: https://medium.com/@LeMarquisOfAndy/the-engineers-guide-to-not-making-your-app-look-awful-8b178b670e27
1) Need to still do my manual end-end testing.
2) Need to fix es-lint ref warnings in AddUserScreen.
3) change package versions from latest to numbers
4) figure out how many places the about menu should be.
5) sentry logging?
  a) - capturing the user info <--  advanced stuff, https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
  b) 
6) download names file?
7) fix empty top text space for long user descriptions: https://stackoverflow.com/questions/50884639/empty-text-space-in-a-continuous-text-component-react-native

### Version 2 feature requests
1) geolocation?


