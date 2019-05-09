import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, TouchableOpacity, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SwipeListView } from 'react-native-swipe-list-view';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';
import colors from '../../styles/colors';

import { listAllUsers, focusUser, deleteUser } from '../../../redux/actions/users';
import {
  container,
  footerSection,
  userContainerStyle,
  rightDrawerOpenValue,
  editRightSlot,
  editRightSlotText,
  deleteRightSlot,
  deleteRightSlotText,
  rowUserBack,
  sortFilterRow,
} from '../../styles/base';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';

import SortIcon from '../../components/icons/SortIcon';

import RightHeaderComponent from '../../components/headers/RightGroupHeader';

import ErrorModal from '../../components/modal/Error';

import DeleteModal from '../../components/modal/Delete';

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
    this.props.navigation.setParams({ getGroupName: this.props.groupsState.focusedGroupName });
    this.props.listAllUsers();
    this.state = {
      sortByModalOpen: false,
      sortOption: 'Date: Old to New (default)',

      userDrawerFocused: null,
      deleteUserModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ groupSubmit: this.groupSubmit });
  }

  static navigationOptions = ({ navigation }) => {
    // groupName is passed by navigateToScreen in adduserScreen
    const groupName = navigation.getParam('groupName') || navigation.getParam('getGroupName') || '';
    return {
      title: groupName,
      headerRight: <RightHeaderComponent />,
    };
  };


  // logic for delete modal user starts
  openUserDeleteModal = () => {
    this.setState({
      deleteUserModalOpen: true,
    });
  }

  closeUserDeleteModal = () => {
    this._swipeListUsersView.safeCloseOpenRow();
    this.setState({
      deleteUserModalOpen: false,
    });
  }

  deleteUser = async () => {
    this.closeUserDeleteModal();
    await this.props.deleteUser(this.state.userDrawerFocused);
    await this.props.listAllUsers();
    await this.setState({ userDrawerFocused: null });
    await this.setState({ deleteUserModalOpen: false });
  }

  deleteUserModal = () => {
    if (this.state.deleteUserModalOpen) {
      return (
        <DeleteModal
          deleteModalOpen={this.state.deleteUserModalOpen}
          deleteFunc={this.deleteUser}
          closeDeleteModal={this.closeUserDeleteModal}
          currentFocusedScreen={this.props.navigation.isFocused()}
          deleteGroup={false}
        />
      );
    }
  }
  // logic for  delete modal user ends

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
          Add a person below!
        </Text>
        <Text style={styles.noGroupMessage}>
          Hint: the best time to add someone&#39;s name is right after you finish meeting them.
        </Text>
      </View>
    );
  }

  groupContents(groupName) {
    const userForGroup = this.usersForGroup(groupName);
    const sortedUsers = this.sortUsers(this.state.sortOption, userForGroup);
    return (
      <SwipeListView
        useFlatList
        data={sortedUsers}
        ref={ref => this._swipeListUsersView = ref}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress = {() => {
              this.props.focusUser(item);
              this.props.navigation.navigate('UserScreen');
            }}
            style={userContainerStyle}
            activeOpacity={0.5}
            underlayColor={colors.touchableHighlightUnderlayColor}
          >
            <UserBox
              primaryGroupName={item.primaryGroupName}
              username={item.name}
              userDescription={item.description}
              date={parseToShortDate(item.createdDate)}
            />
          </TouchableHighlight>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View style={rowUserBack}>
            <TouchableOpacity
              style={editRightSlot}
              onPress = {async () => {
                const { item } = data;
                rowMap[item.userID].closeRow();
                await this.props.focusUser(item);
                await this.props.navigation.navigate('EditUserScreen', {
                  focusedUserName: this.props.usersState.focusedUser.name,
                });
              }}
            >
              <Text style={editRightSlotText}>EDIT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={deleteRightSlot}
              onPress = {() => {
                const { item } = data;
                this.setState({ userDrawerFocused: item });
                this.openUserDeleteModal();
              }}
            >
              <Text style={deleteRightSlotText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={rightDrawerOpenValue}
        disableRightSwipe
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
    const { focusedGroupName } = this.props.groupsState;
    const NumUsersForGroup = this.usersForGroup(focusedGroupName).length;

    return (
      <View style={styles.container}>
        <View style={styles.contents}>
          <View style={sortFilterRow}>
            <SortIcon />
          </View>
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
        {this.deleteUserModal()}
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
    deleteUser: user => dispatch(deleteUser(user)),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
