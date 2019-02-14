import React from 'react';
import { View, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import SearchBar from 'react-native-searchbar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { parseToShortDate } from '../../../lib/dates';

import { focusUser } from '../../../redux/actions/users';
import UserBox from '../../components/users/UserBox';
import { container } from '../../styles/base';
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

  users() {
    return (
      <FlatList
        data={this.state.results}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress = {() => {
              this.props.focusUser(item);
              this.props.focusGroup(item.primaryGroupName);
              const resetAction = StackActions.reset({
                index: 2,
                actions: [
                  NavigationActions.navigate({ routeName: 'GroupsScreen' }),
                  NavigationActions.navigate({ routeName: 'GroupScreen' }),
                  NavigationActions.navigate({ routeName: 'UserScreen' }),
                ],
              });
              this.props.navigation.dispatch(resetAction);
            }}
          >
            <UserBox
              primaryGroupName={item.primaryGroupName}
              username={item.name}
              userDescription={item.description}
              date={parseToShortDate(item.createdDate)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item => `${item.userID}`)}
      />
    );
  }

  usersForGroup(groupName) {
    const { users } = this.props.usersState;
    if (!users) return [];
    const usersInGroup = this.props.usersState.users.filter((user) => {
      return user.primaryGroupName === groupName;
    });
    return usersInGroup;
  }

  render() {
    const groupName = this.props.navigation.getParam('groupName');
    return (
      <View style={styles.container}>
        <SearchBar
          ref={function (ref) {
            this.searchBar = ref;
          }}
          data={groupName ? this.usersForGroup(groupName) : this.props.usersState.users} // if no group name, show ALL USERS
          handleResults={this.handleResults}
          showOnLoad
          placeholder={this.placeHolderText(groupName)}
          heightAdjust={Platform.OS === 'ios' ? 0 : hp('3%')}
          onBack={() => {
            this.props.navigation.navigate('GroupsScreen');
          }}
        />
        <View style={{ marginTop: 55 }}>
          {/* Search bar source code seems to be hard-coded height, so i can get hard-coded marginTop */}
          {this.users()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noGroupHeader: {
    fontWeight: 'bold',
    fontSize: RF(4),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  noGroupMessage: {
    fontSize: RF(2.5),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  noGroupContainer: {
    paddingTop: hp('25%'),
  },
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    backgroundColor: container.backgroundColor,
    paddingLeft: container.paddingLeft,
    paddingRight: container.paddingRight,
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
