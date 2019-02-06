import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';

import { listAllUsers, focusUser } from '../../../redux/actions/users';
import { container, footerSection } from '../../styles/base';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';

import RightHeaderComponent from '../../components/headers/RightGroupHeader';

import ErrorModal from '../../components/modal/Error';
import { getGroupColor } from '../../../lib/groupColors';

import SortBy from '../../components/modal/SortBy';

type Props = {
  groupsState : {
    focusedGroupName: String,
  },
  usersState: {
    users: Array<Object>,
    focusedGroupName: String,
  },
  listAllUsers: () => Promise<Object>,
};

class GroupScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.props.listAllUsers();
    this.state = {
      sortByModalOpen: false,
      sortOption: 'Date: Old to New (default)',
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('groupName', 'GroupScreen'),
      headerRight: <RightHeaderComponent />,
    };
  };

  sortUsers(sortOption, users) {
    let sortedUsers;
    if (sortOption === 'Date: Old to New (default)') {
      sortedUsers = users.sort((a, b) => {
        // Turn strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        const aCreatedDate = new Date(a.createdDate);
        const bCreatedDate = new Date(b.createdDate);
        return aCreatedDate - bCreatedDate;
      });
    }

    if (sortOption === 'Date: New to Old') {
      sortedUsers = users.sort((a, b) => {
        // Turn strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
    }

    if (sortOption === 'Alphabetical') {
      sortedUsers = users.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }

    return sortedUsers;
  }

  openSortModal = () => {
    this.setState({
      sortByModalOpen: true,
    });
  }

  closeSortModal = () => {
    this.setState({
      sortByModalOpen: false,
    });
  }

  applySortModal = (sortOption) => {
    this.setState({
      sortByModalOpen: false,
    });
    this.setSortOption(sortOption);
  }

  setSortOption(sortOption) {
    this.setState({
      sortOption,
    });
  }

  sortOpen() {
    if (this.state.sortByModalOpen) {
      return (
        <SortBy
          sortOption={this.state.sortOption}
          closeSortModal={this.closeSortModal}
          applySortModal={this.applySortModal}
        />
      );
    }
  }


  /**
   * will only get the users where user.primaryGroupName === groupName
   * @param {string} groupName
   */
  usersForGroup(groupName) {
    const { users } = this.props.usersState;
    if (!users) return [];
    const usersInGroup = this.props.usersState.users.filter((user) => {
      return user.primaryGroupName === groupName;
    });
    return usersInGroup;
  }

  noGroupContents() {
    return (
      <View style={styles.noGroupContainer}>
        <Text style={styles.noGroupHeader}>
          Add a user below!
        </Text>
        <Text style={styles.noGroupMessage}>
          Hint: if you want to delete/edit this group, click on the top right 3 vertical circles.
        </Text>
      </View>
    );
  }

  groupContents(groupName) {
    const userForGroup = this.usersForGroup(groupName);
    const sortedUsers = this.sortUsers(this.state.sortOption, userForGroup);
    return (
      <FlatList
        data={sortedUsers}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress = {() => {
              this.props.focusUser(item);
              this.props.navigation.navigate('UserScreen',
                {
                  username: item.name,
                });
            }}
          >
            <UserBox
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

  navigateToAddUserScreen = () => {
    this.props.navigation.navigate('AddUserScreen');
  }

  checkErrUsrs = (err) => {
    // don't want err to render if we're not even on the screen
    if (err) {
      return (
        <ErrorModal
          error={err}
          clearError={this.props.clearUsersErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }

  render() {
    if (this.props.groupsState.loading || this.props.usersState.loading) {
      return null;
    }
    const { focusedGroupName, groups } = this.props.groupsState;
    const NumUsersForGroup = this.usersForGroup(focusedGroupName).length;

    let groupColor;
    try {
      groupColor = getGroupColor(focusedGroupName, groups);
    } catch (err) {
      return null; // because we delete the group, there's a time when we re-render this container but the group doesn't exist anymore
    }
    const borderColor = {
      borderColor: groupColor,
    };
    const combinedContainerStyle = StyleSheet.flatten([styles.container, borderColor]);

    return (
      <View style={combinedContainerStyle}>
        <View style={styles.contents}>
          {NumUsersForGroup ? this.groupContents(focusedGroupName) : this.noGroupContents()}
        </View>
        <View style={footerSection}>
          <Footer
            navigateToAddUserScreen={this.navigateToAddUserScreen}
            sortCB={this.openSortModal}
            numberUsers={NumUsersForGroup}
          />
        </View>
        {this.sortOpen()}
        {this.checkErrUsrs(this.props.usersState.error)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contents: {
    flex: 11,
  },
  container: {
    flex: 1,
    paddingTop: container.paddingTop,
    backgroundColor: container.backgroundColor,
    paddingLeft: container.paddingLeft,
    paddingRight: container.paddingRight,

    borderTopWidth: hp('2%'),
    // paddingBottom: container.paddingBottom,
  },
  noGroupHeader: {
    fontWeight: 'bold',
    fontSize: RF(4),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  buttons: {
    marginBottom: hp('1%'),
  },
  buttonTextSortFilter: {
    color: 'white',
  },
  noGroupMessage: {
    fontSize: RF(2.5),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  noGroupContainer: {
    paddingTop: hp('25%'),
  },
});

const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
  }
);

const mapDispatchToProps = dispatch => (
  {
    listAllUsers: () => dispatch(listAllUsers()),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
