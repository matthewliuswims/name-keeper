import { createStackNavigator, createAppContainer } from 'react-navigation';

import { sectionHeader } from './assets/styles/base';

import AddGroupScreen from './assets/screens/groups/AddGroupScreen';
import GroupsScreen from './assets/screens/groups/GroupsScreen';
import GroupScreen from './assets/screens/groups/GroupScreen';
import UserScreen from './assets/screens/users/UserScreen';
import AddUserScreen from './assets/screens/users/AddUserScreen';
import EditUserScreen from './assets/screens/users/EditUserScreen';
import EditGroupScreen from './assets/screens/groups/EditGroupScreen';
import SearchScreen from './assets/screens/search/SearchScreen';
import AboutScreen from './assets/screens/help/AboutScreen';

// @tutorial: https://reactnavigation.org/docs/en/screen-tracking.html#listening-to-state-changes
// https://reactnavigation.org/docs/en/app-containers.html#onnavigationstatechangeprevstate-newstate-action

const AppNavigator = createStackNavigator({
  GroupsScreen: { screen: GroupsScreen },
  GroupScreen: { screen: GroupScreen },
  AddGroupScreen: { screen: AddGroupScreen },
  UserScreen: { screen: UserScreen },
  AddUserScreen: { screen: AddUserScreen },
  EditUserScreen: { screen: EditUserScreen },
  EditGroupScreen: { screen: EditGroupScreen },
  SearchScreen: { screen: SearchScreen },
  AboutScreen: { screen: AboutScreen },
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: sectionHeader.backgroundColor, // commmon to everything, can also add other stuff too
    },
    headerBackTitle: null,
    headerTitleStyle: { color: sectionHeader.color },
    headerBackTitleStyle: {
      color: sectionHeader.color,
    },
    headerTintColor: sectionHeader.color,
  },

  headerLayoutPreset: sectionHeader.headerLayoutPreset,
});


export default createAppContainer(AppNavigator);
