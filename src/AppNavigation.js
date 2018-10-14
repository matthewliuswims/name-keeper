import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { sectionHeader } from './assets/styles/base';

import AddGroupScreen from './assets/screens/groups/AddGroupScreen';
import GroupsScreen from './assets/screens/groups/GroupsScreen';
import GroupScreen from './assets/screens/groups/GroupScreen';
import UsersScreen from './assets/screens/users/UsersScreen';
import UserScreen from './assets/screens/users/UserScreen';
import AddUserScreen from './assets/screens/users/AddUserScreen';

export default class AppNavigation extends React.Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createStackNavigator({
  GroupsScreen: { screen: GroupsScreen },
  GroupScreen: { screen: GroupScreen },
  AddGroupScreen: { screen: AddGroupScreen },
  UsersScreen: { screen: UsersScreen }, // prolly don't need?
  UserScreen: { screen: UserScreen },
  AddUserScreen: { screen: AddUserScreen },
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: sectionHeader.backgroundColor, // commmon to everything, can also add other stuff too
    },
    headerTitleStyle: { color: sectionHeader.color },
    headerBackTitleStyle: {
      color: sectionHeader.color,
    },
    headerTintColor: sectionHeader.color,
  },
  headerLayoutPreset: sectionHeader.headerLayoutPreset,
});
