import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, TouchableOpacity, Text } from 'react-native';
import Toast from 'react-native-easy-toast';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';
import colors from '../../styles/colors';

import { listAllUsers, focusUser, deleteUser } from '../../../redux/actions/users';
import {
  container,
  userContainerStyle,
  rightDrawerOpenValue,
  editRightSlot,
  deleteRightSlot,
  rowUserBack,
  sortFilterRow,
  logoWrapper,
  noGroupsContainer,
  addMessage,
  addHeader,
  toastWrapper,
} from '../../styles/base';

import {
  clearToast,
  addToast,
} from '../../../redux/actions/toasts';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';

import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';

import SortIcon from '../../components/icons/SortIcon';

import RightHeaderComponent from '../../components/headers/RightGroupHeader';

import ErrorModal from '../../components/modal/Error';

import DeleteModal from '../../components/modal/Delete';

import SortBy from '../../components/modal/SortBy';

import Logo from '../../../../assets/undraw_pilates_gpdb.svg';

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

  componentDidUpdate() {
    // for toasts
    const showToast = this.props.toastsState.showingToast;
    if (!showToast) return;
    const correctScreen = this.props.toastsState.screenName === this.props.navigation.state.routeName;
    // have to check ref existence, because of https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback
    if (showToast && this.toasteroni && correctScreen) {
      this.toasteroni.show(this.props.toastsState.message, 2000);
      // i have no idea why I need a timeout (and a timeout that is 1000)
      // but without it, the toast sometimes won't appear (if I go directly to the edit screen)
      // from the header
      setTimeout(() => this.props.clearToast(), 1000);
    }
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

    this.props.addToast('Deleted Person', this.props.navigation.state.routeName);
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
    this.props.addToast(`Sorting by ${sortOption}`, this.props.navigation.state.routeName);
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
      <View style={noGroupsContainer}>
        <View style={logoWrapper}>
          <Logo width={hp('40%')} height={hp('40%')} />
        </View>
        <Text style={addHeader}>
          Add a person below!
        </Text>
        <Text style={addMessage}>
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
              <Icon
                name='edit'
                color='white'
                size={35}
                iconStyle={{
                  padding: 10,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={deleteRightSlot}
              onPress = {() => {
                const { item } = data;
                this.setState({ userDrawerFocused: item });
                this.openUserDeleteModal();
              }}
            >
              <Icon
                name='delete'
                color='white'
                size={35}
                iconStyle={{
                  padding: 10,
                }}
              />
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

  sortHeader = () => {
    return (
      <View style={sortFilterRow}>
        <SortIcon
          sortCB={this.openSortModal}
        />
      </View>
    );
  }

  render() {
    if (this.props.groupsState.loading || this.props.usersState.loading) {
      return (
        <LoadingSpinner />
      );
    }
    const { focusedGroupName } = this.props.groupsState;
    const NumUsersForGroup = this.usersForGroup(focusedGroupName).length;
    const showSortHeader = NumUsersForGroup > 0;
    return (
      <View style={styles.container}>
        <View style={styles.contents}>
          {showSortHeader && this.sortHeader()}
          {NumUsersForGroup ? this.groupContents(focusedGroupName) : this.noGroupContents()}
        </View>
        <Footer
          navigateToAddUserScreen={this.navigateToAddUserScreen}
          sortCB={this.openSortModal}
          numberUsers={NumUsersForGroup}
        />
        {this.sortOpen()}
        {this.deleteUserModal()}
        {this.checkErrUsrs(this.props.usersState.error)}
        <Toast
          ref={ele => this.toasteroni = ele}
          style={toastWrapper}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    backgroundColor: colors.containerBackgroundColor,
  },
  contents: {
    flex: 11,
  },
  buttons: {
    marginBottom: hp('1%'),
  },
  buttonTextSortFilter: {
    color: 'white',
  },
});

const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
    toastsState: state.toasts,
  }
);

const mapDispatchToProps = dispatch => (
  {
    addToast: (message, screenName) => dispatch(addToast(message, screenName)),
    clearToast: () => dispatch(clearToast()),
    listAllUsers: () => dispatch(listAllUsers()),
    deleteUser: user => dispatch(deleteUser(user)),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
