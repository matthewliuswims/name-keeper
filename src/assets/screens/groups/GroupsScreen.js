import Sentry from 'sentry-expo';
import PropTypes from 'prop-types';

import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';
import RF from 'react-native-responsive-fontsize';
import { get } from 'lodash';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
  container,
  horizontalGroupScreenButton,
  footerSection,
  groupContainerStyle,
  userContainerStyle,
  rightDrawerOpenValue,
  editRightSlot,
  editRightSlotText,
  deleteRightSlot,
  deleteRightSlotText,
  rowUserBack,
} from '../../styles/base';

import colors from '../../styles/colors';

import Footer from '../../components/footer/footer';
import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';
import ErrorModal from '../../components/modal/Error';

import DeleteModal from '../../components/modal/Delete';

import { listAllUsers, focusUser, deleteUser } from '../../../redux/actions/users';

import { listGroups, clearGroupsErr, focusGroup, deleteGroup } from '../../../redux/actions/groups';
import Group from '../../components/groups/GroupBox';
import RightHeaderComponent from '../../components/headers/RightGroupsHeader';
import LeftHeaderComponent from '../../components/headers/LeftGroupsHeader';

import { parseToShortDate } from '../../../lib/dates';
import UserBox from '../../components/users/UserBox';

import { usersGroupNamesMatch } from '../../../lib/actions';

import SortBy from '../../components/modal/SortBy';
import Filter from '../../components/modal/Filter';

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class GroupsScreen extends Component {
  constructor(props) {
    Sentry.captureMessage('Groups screen Initialzied for a user', {
      level: 'info', // one of 'info', 'warning', or 'error'
    });
    super(props);
    this.props.listGroups(); // also called in compoenntDidMount, but this is used so we can see groups quicker on screen
    this.props.listAllUsers();
    this.state = {
      groupNameDrawerFocused: '',
      deleteGroupModalOpen: false,

      userDrawerFocused: null,
      deleteUserModalOpen: false,

      showingGroups: true,
      sortByModalOpen: false,
      filterModalOpen: false,
      screenTitle: 'Groups',
      sortedFilteredUsersWrapper: {
        // computed data shouldn't be stored in the state of the object, which is why sortedFiltererdUsers isn't here
        sortOption: 'Date: Old to New (default)',
        selectedFilteredGroups: [], // populated in componentDidMount
      },
    };
  }

  /**
   * CALLED in constructor and in componentDidMount
   * @param groupsOriginal - this.props.groups, redux state of groups
   * @return takes on form of Array of objects - where each object is a redux group WITH added fields
   * the added fields can be of form: added: true, opacity: 1, isFocusedGroup: true.
   *
   */
  filteredGroupsInitial(groups) {
    let focusedGroup;

    const addedGroups = groups.map((group) => {
      const clonedGroupTarget = Object.assign({}, group);
      focusedGroup = Object.assign(clonedGroupTarget, { added: true, opacity: 1 });
      return focusedGroup;
    });

    return addedGroups;
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: params.screenTitle,
      headerRight: <RightHeaderComponent />,
      // getParam('swap') refers to the 'swap' function in componentDidMount
      headerLeft: <LeftHeaderComponent
        swap={navigation.getParam('swap') || noOp}
        showingGroups={params.showingGroups}
      />,
    };
  };

  componentDidUpdate(prevProps) {
    // this is when we add a group from addgroupscreen
    // we need to update selectedGroupName
    if (this.props.groupsState.groups.length !== prevProps.groupsState.groups.length) {
      this.populateFilteredGroupsInitial();
    }
  }


  componentDidMount() {
    const { showingGroups, screenTitle } = this.state;
    this.props.navigation.setParams({ screenTitle });
    this.props.navigation.setParams({ showingGroups });
    this.props.navigation.setParams({ swap: this.swap });
    this.props.navigation.setParams({ getTotalNumberUsers: this.getTotalNumberUsers });

    this.populateFilteredGroupsInitial();
  }

  populateFilteredGroupsInitial = async () => {
    this.props.listGroups().then(() => {
      this.setState((state) => {
        const { sortOption } = state.sortedFilteredUsersWrapper;
        const selectedFilteredGroups = this.filteredGroupsInitial(this.props.groupsState.groups);
        return {
          sortedFilteredUsersWrapper: {
            sortOption,
            selectedFilteredGroups,
          },
        };
      });
    });
  }


  updateGroupsList = () => {
    this.props.listGroups();
  }

  checkErr = (err) => {
    // don't want err to render if we're not even on the screen
    if (err) {
      return (
        <ErrorModal
          error={err}
          clearError={this.props.clearGroupsErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }

  getUserNamesForGroup(groupName, users) {
    const parsedUsers = users.filter(user => user.primaryGroupName === groupName);
    return parsedUsers.map(user => user.name);
  }

  noGroupsText() {
    return (
      <View style={styles.noGroupsOrUsersContainer}>
        <Text style={styles.noGroupsOrUsersHeader}>
          Add a group below
        </Text>
        <Text style={styles.noGroupsOrUsersMessage}>
          A group contains the people you meet.
        </Text>
      </View>
    );
  }

  //  logic for delete modal group
  openGroupDeleteModal = () => {
    this.setState({
      deleteGroupModalOpen: true,
    });
  }

  closeGroupDeleteModal = () => {
    this._swipeListGroupsView.safeCloseOpenRow();
    this.setState({
      deleteGroupModalOpen: false,
    });
  }

  deleteGroup = async () => {
    await this.props.deleteGroup(this.state.groupNameDrawerFocused);
    await this.props.navigation.navigate('GroupsScreen');
    await this.props.listAllUsers();
    await this.props.listGroups();
    await this.setState({ groupNameDrawerFocused: '' });
    await this.setState({ deleteGroupModalOpen: false });
  }

  deleteGroupModal = () => {
    if (this.state.deleteGroupModalOpen) {
      return (
        <DeleteModal
          deleteModalOpen={this.state.deleteGroupModalOpen}
          deleteFunc={this.deleteGroup}
          closeDeleteModal={this.closeGroupDeleteModal}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }
  // logic for delete modal group ends

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


  groups = (users) => {
    const { groups } = this.props.groupsState;
    const { usersState } = this.props;
    return (
      <SwipeListView
        useFlatList
        ref={ref => this._swipeListGroupsView = ref}
        data={groups}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress = {() => {
              this.props.focusGroup(item.name);
              this.props.navigation.navigate('GroupScreen',
                {
                  groupName: item.name,
                });
            }}
            style={groupContainerStyle}
            activeOpacity={0.5}
            underlayColor={colors.touchableHighlightUnderlayColor}
          >
            <Group
              groupName={item.name}
              usersLength={users.length}
              userNamesForGroup={this.getUserNamesForGroup(item.name, users)}
              groups={groups}
              />
          </TouchableHighlight>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowGroupBack}>
            <TouchableOpacity
              style={editRightSlot}
              onPress = {async () => {
                this._swipeListGroupsView.safeCloseOpenRow();
                await this.props.focusGroup(item.name);
                await this.props.navigation.navigate('EditGroupScreen');
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
                this.setState({ groupNameDrawerFocused: item.name });
                this.openGroupDeleteModal();
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
        keyExtractor={(item => `${item.groupID}`)}
        rightOpenValue={rightDrawerOpenValue}
        extraData={usersState}
        disableRightSwipe
      />
    );
  }

  swap = () => {
    this.setState((state) => {
      const showingGroups = !state.showingGroups;
      this.props.navigation.setParams({
        showingGroups,
      });

      if (showingGroups) {
        this.props.navigation.setParams({
          screenTitle: 'Groups',
        });
        return {
          showingGroups,
        };
      }

      // not showing groups logic below
      this.props.navigation.setParams({
        screenTitle: 'People',
      });
      const sortOption = 'Date: Old to New (default)';
      const selectedFilteredGroups = this.filteredGroupsInitial(this.props.groupsState.groups);
      return {
        sortedFilteredUsersWrapper: {
          sortOption,
          selectedFilteredGroups,
        },
        showingGroups,
      };
    });
  }

  groupsList = (numberGroups, users) => {
    return numberGroups ? this.groups(users) : this.noGroupsText();
  }

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

  /**
   * filters all the users based upon the grups their in
   */
  filterUsers(selectedFilteredGroups, users) {
    const filteredGroups = selectedFilteredGroups.filter(group => group.added);
    const filteredGroupNames = filteredGroups.map(group => group.name);
    const filteredUsers = usersGroupNamesMatch(filteredGroupNames, users);
    return filteredUsers;
  }


  sortedAndFilteredUsers(sortOption, selectedFilteredGroups, users) {
    const usersCopy = users.slice();

    const sortedUsers = this.sortUsers(sortOption, usersCopy);
    const sortAndFilteredUsers = this.filterUsers(selectedFilteredGroups, sortedUsers);
    return sortAndFilteredUsers;
  }

  usersList = (numberGroups, numberUsers, sortOption, selectedFilteredGroups, users) => {
    return numberUsers ? this.usersListWithUsers(sortOption, selectedFilteredGroups, users) : this.noUsersText(numberGroups);
  }

  noUsersText(numberGroups) {
    // so there are no users and no groups
    if (!numberGroups) {
      return (
        <View style={styles.noGroupsOrUsersContainer}>
          <Text style={styles.noGroupsOrUsersHeader}>
            {'Click "Groups" at the top-left to create a group'}
          </Text>
          <Text style={styles.noGroupsOrUsersMessage}>
            You need to create a group before you can add a user.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.noGroupsOrUsersContainer}>
        <Text style={styles.noGroupsOrUsersHeader}>
          Add a person you met below!
        </Text>
        <Text style={styles.noGroupsOrUsersMessage}>
          That person will be placed by you into one of the groups you made!
        </Text>
      </View>
    );
  }

  usersListWithUsers = (sortOption, selectedFilteredGroups, users) => {
    const { usersState } = this.props;
    const sortFilteredUsers = this.sortedAndFilteredUsers(sortOption, selectedFilteredGroups, users);
    return (
      <View style={styles.usersListText}>
        <SwipeListView
          useFlatList
          ref={ref => this._swipeListUsersView = ref}
          data={sortFilteredUsers}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress = {() => {
                this.props.focusUser(item);
                this.props.focusGroup(item.primaryGroupName);
                this.props.navigation.navigate('UserScreen');
              }}
              style={userContainerStyle}
              activeOpacity={0.5}
              underlayColor={colors.touchableHighlightUnderlayColor}
            >
              <UserBox
                username={item.name}
                primaryGroupName={item.primaryGroupName}
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
                  await this.props.focusGroup(item.primaryGroupName);
                  await this.props.navigation.navigate('EditUserScreen', {
                    focusedUserName: this.props.usersState.focusedUser.name,
                    editUserFromUsersScreen: 'true',
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
          keyExtractor={(item => `${item.userID}`)}
          rightOpenValue={rightDrawerOpenValue}
          extraData={usersState}
          disableRightSwipe
        />
      </View>
    );
  }


  sortOpen() {
    if (this.state.sortByModalOpen) {
      return (
        <SortBy
          sortOption={this.state.sortedFilteredUsersWrapper.sortOption}
          closeSortModal={this.closeSortModal}
          applySortModal={this.applySortModal}
        />
      );
    }
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
    this.setState((state) => {
      const { selectedFilteredGroups } = state.sortedFilteredUsersWrapper;
      return {
        sortedFilteredUsersWrapper: {
          sortOption,
          selectedFilteredGroups,
        },
      };
    });
  }


  filterOpen() {
    if (this.state.filterModalOpen) {
      return (
        <Filter
          closeFilterModal={this.closeFilterModal}
          applyFilterModal={this.applyFilterModal}
          filteredGroups={this.state.sortedFilteredUsersWrapper.selectedFilteredGroups}
        />
      );
    }
  }

  openFilterModal = () => {
    this.setState({
      filterModalOpen: true,
    });
  }

  closeFilterModal = () => {
    this.setState({
      filterModalOpen: false,
    });
  }

  applyFilterModal = (filteredGroups) => {
    this.setState({
      filterModalOpen: false,
    });
    this.setNewFilteredGroups(filteredGroups);
  }

  setNewFilteredGroups(changedGroups) {
    this.setState((state) => {
      const { sortOption } = state.sortedFilteredUsersWrapper;
      return {
        sortedFilteredUsersWrapper: {
          selectedFilteredGroups: changedGroups,
          sortOption,
        },
      };
    });
  }

  footerGroupsList = () => {
    return (
      <View elevation={5} style={{ flex: 1 }}>
        <TouchableOpacity
          onPress = {() => {
            if (this._swipeListGroupsView) {
              this._swipeListGroupsView.safeCloseOpenRow();
            }
            this.props.navigation.navigate('AddGroupScreen', {
              editUserFromUsersScreen: 'true',
            });
          }
          }
          style={styles.button}
        >
          <Text style={styles.groupText}>Add Group</Text>
        </TouchableOpacity>
      </View>
    );
  }

  navigateToAddUserScreen = () => {
    if (this._swipeListUsersView) {
      this._swipeListUsersView.safeCloseOpenRow();
    }
    const firstGroupNameWeFind = get(this.props.groupsState, 'groups[0].name', '');
    if (!firstGroupNameWeFind) {
      Sentry.captureException(new Error('Catastrophic Error: tried to add a user, but could not get a default group to give that user'));
    }
    this.props.focusGroup(firstGroupNameWeFind); // arbitrarily focus the first group name we find
    this.props.navigation.navigate('AddUserScreen', {
      addUserFromUsersScreen: 'true',
    });
  }

  renderContents = (numberGroups, users, numberUsers, sortOption, selectedFilteredGroups) => {
    if (this.state.showingGroups) {
      return this.groupsList(numberGroups, users);
    }
    return this.usersList(numberGroups, numberUsers, sortOption, selectedFilteredGroups, users);
  }

  renderFooter = (numberGroups, numberUsers) => {
    if (this.state.showingGroups) {
      return this.footerGroupsList();
    }

    // viewing users and there are no groups
    if (!this.state.showingGroups && !numberGroups) {
      return null;
    }

    // viewing users
    return (
      <Footer
        numberUsers={numberUsers}
        navigateToAddUserScreen={this.navigateToAddUserScreen}
        filterCB={this.openFilterModal}
        sortCB={this.openSortModal}
      />
    );
  }

  render() {
    const { error: groupsStateErr, groups, loading } = this.props.groupsState;
    const { users, loading: usersStateLoading } = this.props.usersState;
    if (loading || usersStateLoading) {
      return (
        <LoadingSpinner />
      );
    }
    const { sortOption, selectedFilteredGroups } = this.state.sortedFilteredUsersWrapper;

    const numberGroups = groups.length;
    const numberUsers = users.length;
    return (
      <View style={container}>
        <View style={styles.contents}>
          { this.renderContents(numberGroups, users, numberUsers, sortOption, selectedFilteredGroups)}
        </View>
        <View style={footerSection}>
          { this.renderFooter(numberGroups, numberUsers) }
        </View>
        {this.sortOpen()}
        {this.filterOpen()}
        {this.deleteGroupModal()}
        {this.deleteUserModal()}
        {this.checkErr(groupsStateErr)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // rowGroupBack needs to match grouPContainer style, since rowGroupBack
  // is just the hidden version of groupContainer Style
  usersList: {
    marginBottom: hp('0.5%'),
  },
  rowGroupBack: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderWidth: groupContainerStyle.borderWidth,
    borderRadius: groupContainerStyle.borderRadius,
    flex: 1,
    marginBottom: groupContainerStyle.marginBottom, // needs to match groupContainerStyle
  },
  groupText: {
    fontSize: hp('2.75%'),
    fontWeight: 'bold',
    color: 'white',
  },
  contents: {
    flex: 11,
  },
  noGroupsOrUsersHeader: {
    fontWeight: 'bold',
    fontSize: RF(4),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  noGroupsOrUsersMessage: {
    fontSize: RF(2.5),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  noGroupsOrUsersContainer: {
    paddingTop: hp('25%'),
    paddingBottom: hp('30%'),
  },
  touchHereText: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: colors.addApplyColor,
    justifyContent: 'center',
    alignItems: horizontalGroupScreenButton.alignItems,
    borderRadius: 4,
    shadowColor: horizontalGroupScreenButton.shadowColor,
    shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    shadowRadius: horizontalGroupScreenButton.shadowRadius,
    shadowOffset: horizontalGroupScreenButton.shadowOffset,
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
    listGroups: () => dispatch(listGroups()),
    deleteGroup: user => dispatch(deleteGroup(user)),
    clearGroupsErr: () => dispatch(clearGroupsErr()),
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    listAllUsers: () => dispatch(listAllUsers()),
    focusUser: user => dispatch(focusUser(user)),
    deleteUser: user => dispatch(deleteUser(user)),
  }
);

GroupsScreen.propTypes = {
  navigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types

  listGroups: PropTypes.func.isRequired,
  clearGroupsErr: PropTypes.func.isRequired,
  focusGroup: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  listAllUsers: PropTypes.func.isRequired,
  focusUser: PropTypes.func.isRequired,

  groupsState: PropTypes.shape({
    groups: PropTypes.array,
    error: PropTypes.object,
  }).isRequired,
  usersState: PropTypes.shape({
    users: PropTypes.array,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
