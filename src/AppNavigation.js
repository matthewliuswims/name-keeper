import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { sectionHeader } from './assets/styles/base';

import AddGroupScreen from './assets/screens/groups/AddGroupScreen';
import GroupsScreen from './assets/screens/groups/GroupsScreen';
import UsersScreen from './assets/screens/users/UsersScreen';
import UserScreen from './assets/screens/users/UserScreen';

export default class AppNavigation extends React.Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createStackNavigator({
  GroupsScreen: { screen: GroupsScreen },
  AddGroupScreen: { screen: AddGroupScreen },
  UsersScreen: { screen: UsersScreen },
  UserScreen: { screen: UserScreen },
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: sectionHeader.backgroundColor, // commmon to everything, can also add other stuff too
    },
    headerTitleStyle: {
      color: sectionHeader.color,
    },
  },
  headerLayoutPreset: sectionHeader.headerLayoutPreset,
});
