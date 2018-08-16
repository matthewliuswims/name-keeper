import React from 'react';
import { createStackNavigator } from 'react-navigation';

import GroupsScreen from './src/assets/screens/groups/GroupsScreen';
import UsersScreen from './src/assets/screens/UsersScreen';
import UserScreen from './src/assets/screens/UserScreen';

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createStackNavigator({
  GroupsScreen: { screen: GroupsScreen },
  UsersScreen: { screen: UsersScreen },
  UserScreen: { screen: UserScreen },
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#499EFF', // commmon to everything, can also add other stuff too
    },
  },
  headerLayoutPreset: 'center',
});
