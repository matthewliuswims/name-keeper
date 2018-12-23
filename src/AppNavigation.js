import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { sectionHeader } from './assets/styles/base';

import AddGroupScreen from './assets/screens/groups/AddGroupScreen';
import GroupsScreen from './assets/screens/groups/GroupsScreen';
import GroupScreen from './assets/screens/groups/GroupScreen';
import UserScreen from './assets/screens/users/UserScreen';
import AddUserScreen from './assets/screens/users/AddUserScreen';
import EditUserScreen from './assets/screens/users/EditUserScreen';

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
  UserScreen: { screen: UserScreen },
  AddUserScreen: { screen: AddUserScreen },
  EditUserScreen: { screen: EditUserScreen },
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
