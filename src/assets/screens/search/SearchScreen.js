import React from 'react';
import { View, Platform, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import SearchBar from 'react-native-searchbar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { parseToShortDate } from '../../../lib/dates';

import { focusUser } from '../../../redux/actions/users';
import UserBox from '../../components/users/UserBox';
import { container, userContainerStyle } from '../../styles/base';
import { focusGroup } from '../../../redux/actions/groups';

class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
    this.handleResults = this.handleResults.bind(this);
  }

  handleResults(results) {
    this.setState({ results });
  }

  placeHolderText(groupName) {
    if (groupName) return `Search in ${groupName} by name, location, descrption...`;

    return 'Search ALL users by name, location, descrption...';
  }

  users(groupName) {
    const actions = groupName ? [
      NavigationActions.navigate({ routeName: 'GroupsScreen' }),
      NavigationActions.navigate({ routeName: 'GroupScreen' }),
      NavigationActions.navigate({
        routeName: 'UserScreen',
        params: {
          fromSearchGroupScreen: true,
        },
      }),
    ] : [
      NavigationActions.navigate({ routeName: 'GroupsScreen' }),
      NavigationActions.navigate({
        routeName: 'UserScreen',
        params: {
          fromSearchGroupScreen: '',
        },
      }),
    ];

    return (
      <FlatList
        keyboardShouldPersistTaps='always'
        data={this.state.results}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress = {() => {
              this.props.focusUser(item);
              this.props.focusGroup(item.primaryGroupName);
              const resetAction = StackActions.reset({
                index: groupName ? 2 : 1,
                actions,
              });
              this.props.navigation.dispatch(resetAction);
            }}
            style={userContainerStyle}
          >
            <UserBox
              primaryGroupName={item.primaryGroupName}
              username={item.name}
              userDescription={item.description}
              date={parseToShortDate(item.lastEdit)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item => `${item.userID}`)}
      />
    );
  }

  usersForGroup(usersWithoutAnimatedSlotOpacity, groupName) {
    if (!usersWithoutAnimatedSlotOpacity) return [];
    const usersInGroup = usersWithoutAnimatedSlotOpacity.filter((user) => {
      return user.primaryGroupName === groupName;
    });
    return usersInGroup;
  }

  render() {
    const groupName = this.props.navigation.getParam('groupName');
    const usersWithoutAnimatedSlotOpacity = this.props.usersState.users.map((user) => {
      const userCopy = {
        ...user,
      };
      delete userCopy.animatedSlotOpacity; // has a lot of crap potentially (can be super nested)
      return userCopy;
    });
    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps='always'
        >
          <SearchBar
            ref={function (ref) {
              this.searchBar = ref;
            }}
            data={groupName ? this.usersForGroup(usersWithoutAnimatedSlotOpacity, groupName) : usersWithoutAnimatedSlotOpacity} // if no group name, show ALL USERS
            handleResults={this.handleResults}
            showOnLoad
            placeholder={this.placeHolderText(groupName)}
            heightAdjust={Platform.OS === 'ios' ? 0 : hp('3%')}
            onBack={() => {
              this.props.navigation.goBack();
            }}
            autoCorrect={false}
          />
          <View style={styles.container}>
            {/* Search bar source code seems to be hard-coded height, so i can get hard-coded marginTop */}
            {this.users(groupName)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    marginTop: 80,
  },
});

const mapStateToProps = state => (
  {
    usersState: state.users,
  }
);

const mapDispatchToProps = dispatch => (
  {
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(SearchScreen));
