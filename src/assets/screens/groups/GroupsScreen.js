import Sentry from 'sentry-expo';
import PropTypes from 'prop-types';

import Toast from 'react-native-easy-toast';

import React, { Component } from 'react';

import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import { get } from 'lodash';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import SortIcon from '../../components/icons/SortIcon';
import FilterIcon from '../../components/icons/FilterIcon';

import Logo from '../../../../assets/undraw_having_fun_iais.svg';
import LogoPilates from '../../../../assets/undraw_pilates_gpdb.svg';


import { SLOT_FADE_OUT_DURATION } from '../../components/animations/DURATIONS';
import FadeInOut from '../../components/animations/fade-in-out-slot';


import {
  container,
  horizontalGroupScreenButton,
  footerBottomDimensions,
  groupContainerStyle,
  userContainerStyle,
  rightDrawerOpenValue,
  deleteRightSlot,
  rowUserBack,
  sortFilterRow,
  logoWrapper,
  noGroupsContainer,
  addHeader,
  addMessage,
  toastWrapper,
} from '../../styles/base';

import colors from '../../styles/colors';

import Footer from '../../components/footer/footer';
import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';
import ErrorModal from '../../components/modal/Error';

import DeleteModal from '../../components/modal/Delete';

import { listAllUsers, focusUser, deleteUser } from '../../../redux/actions/users';

import { addToast, clearToast } from '../../../redux/actions/toasts';

import { listGroups, clearGroupsErr, focusGroup, deleteGroup } from '../../../redux/actions/groups';
import Group from '../../components/groups/GroupBox';
import RightHeaderComponent from '../../components/headers/RightGroupsHeader';
import LeftHeaderComponent from '../../components/headers/LeftGroupsHeader';

import { parseToShortDate } from '../../../lib/dates';

import UserBox from '../../components/users/UserBox';

import { usersGroupNamesMatch } from '../../../lib/actions';

import SortBy from '../../components/modal/SortBy';
import Filter from '../../components/modal/Filter';

import FadeIn from '../../components/animations/fade-in';

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class GroupsScreen extends Component {
  constructor(props) {
    Sentry.captureMessage('Groups screen Initialzied for a user', {
      level: 'info', // one of 'info', 'warning', or 'error'
    });
    super(props);
    this.props.listAllUsers();
    this.offset = 0;
    this.state = {
      groupDrawerFocused: null,
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
      direction: 'up',
    };
  }

  /**
   * @param groupsOriginal - this.props.groups, redux state of groups
   * @return takes on form of Array of objects - where each object is a redux group WITH added fields
   * the added fields can be of form: added: true, opacity: 1, isFocusedGroup: true. we need these key/value
   * pairs for Filter.js
   *
   */
  withFilterProperties(groups) {
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

  componentDidUpdate() {
    const showToast = this.props.toastsState.showingToast;
    if (!showToast) return;
    const correctScreen = this.props.toastsState.screenName === this.props.navigation.state.routeName;
    if (showToast && this.toast && correctScreen) {
      // i have no idea why I need a timeout (and a timeout that is 1000)
      // but without it, the toast sometimes won't appear (if I go directly to the edit screen)
      // from the header
      this.toast.show(this.props.toastsState.message, 2000);
      setTimeout(() => this.props.clearToast(), 1000);
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
        const selectedFilteredGroups = this.withFilterProperties(this.props.groupsState.groups);
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

  noGroupsText = () => {
    return (
      <FadeIn style={noGroupsContainer}>
        <View style={logoWrapper}>
          <Logo width={hp('40%')} height={hp('30%')} />
        </View>
        <Text style={addHeader}>
          Add a group below
        </Text>
        <Text style={addMessage}>
          A group contains the names of people you meet.
        </Text>
        <Footer
          showAddUserButton={false}
          addGroupCB={this.addGroupCB}
          numberUsers={0}
          navigateToAddUserScreen={this.navigateToAddUserScreen}
          filterCB={this.openFilterModal}
          sortCB={this.openSortModal}
        />
      </FadeIn>
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
    await this.closeGroupDeleteModal();
    Animated.timing(this.state.groupDrawerFocused.animatedSlotOpacity, {
      toValue: 0,
      duration: SLOT_FADE_OUT_DURATION,
    }).start(async () => {
      await this.props.deleteGroup(this.state.groupDrawerFocused.name);
      await this.props.listAllUsers();
      await this.props.listGroups();
      await this.setState({ groupDrawerFocused: null });
      this.props.addToast('Deleted Group', this.props.navigation.state.routeName);
      await this.props.navigation.navigate('GroupsScreen');
    });
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

  deleteUser = () => {
    this.closeUserDeleteModal();
    Animated.timing(this.state.userDrawerFocused.animatedSlotOpacity, {
      toValue: 0,
      duration: SLOT_FADE_OUT_DURATION,
    }).start(async () => {
      await this.props.deleteUser(this.state.userDrawerFocused);
      await this.props.listAllUsers();
      await this.setState({ userDrawerFocused: null });
      await this.setState({ deleteUserModalOpen: false });
      this.props.addToast('Deleted Person', this.props.navigation.state.routeName);
    });
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

  onScroll = (e) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    // @tutorial: https://stackoverflow.com/questions/41056761/detect-scrollview-has-reached-the-end
    const currentOffset = contentOffset.y; // offset is how far we've come from top of the list (e.g. 212 at end of list, 0 at start)
    const layoutMeasurementHeight = layoutMeasurement.height; // just the list height itself (e.g. 433)
    const contentSizeHeight = contentSize.height; // end-end scroll height (e.g. 645)

    const listIsNotFilled = contentSizeHeight < layoutMeasurementHeight;

    const pastEnd = layoutMeasurementHeight + currentOffset + 10 > contentSizeHeight; // to account for the ability to scroll past the end (i.e. the bounce);
    const pastTop = (currentOffset || this.offset) < 0;
    const movingDown = currentOffset > this.offset;
    let direction = 'up';
    if (movingDown || pastEnd) {
      direction = 'down';
    }
    if (pastTop || listIsNotFilled) {
      direction = 'up';
    }

    this.offset = currentOffset;
    this.setState({
      direction,
    });
  }


  groups = (users, numberGroups, numberUsers) => {
    const { groups } = this.props.groupsState;
    const { usersState } = this.props;
    // the outer viewer wrap (for w/e reason) is necessary for the child FadeIn (now made back into a View) to work when toggling back and forth between the users and groups screen
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <SwipeListView
            scrollEventThrottle={120}
            onScroll={this.onScroll}
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
                <FadeInOut
                  style={{ flex: 1 }}
                  _animated={item.animatedSlotOpacity}
                >
                  <Group
                    groupName={item.name}
                    date={item.date}
                    usersLength={users.length}
                    userNamesForGroup={this.getUserNamesForGroup(item.name, users)}
                    groups={groups}
                  />
                </FadeInOut>
              </TouchableHighlight>
            )}
            renderHiddenItem={({ item }) => (
              <View style={styles.rowGroupBack}>
                <TouchableOpacity
                  style={deleteRightSlot}
                  onPress = {() => {
                    this.setState({ groupDrawerFocused: item });
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
          { this.renderFooter(numberGroups, numberUsers) }
        </View>
      </View>
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

      const selectedFilteredGroups = this.withFilterProperties(this.props.groupsState.groups); // need this in case have a new group created

      return {
        sortedFilteredUsersWrapper: {
          sortOption,
          selectedFilteredGroups,
        },
        showingGroups,
      };
    });
  }

  groupsList = (numberGroups, users, numberUsers) => {
    return numberGroups ? this.groups(users, numberGroups, numberUsers) : this.noGroupsText();
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
    return numberUsers ? this.usersListWithUsers(sortOption, selectedFilteredGroups, users, numberGroups, numberUsers) : this.noUsersText(numberGroups);
  }

  noUsersText(numberGroups) {
    // so there are no users and no groups
    if (!numberGroups) {
      return (
        <View style={styles.noUsersContainer}>
          <Text style={addHeader}>
            {'Click "Groups" at the top-left to create a group'}
          </Text>
          <Text style={addMessage}>
            You need to create a group before you can add a user.
          </Text>
        </View>
      );
    }
    return (
      <View style={noGroupsContainer}>
        <View style={logoWrapper}>
          <LogoPilates width={hp('40%')} height={hp('30%')} />
        </View>
        <Text style={addHeader}>
          Add a person below!
        </Text>
        <Text style={addMessage}>
          Hint: the best time to add someone&#39;s name is right after you finish meeting them.
        </Text>
        <Footer
          showAddUserButton
          addGroupCB={null}
          numberUsers={0}
          navigateToAddUserScreen={this.navigateToAddUserScreen}
          filterCB={this.openFilterModal}
          sortCB={this.openSortModal}
        />
      </View>
    );
  }

  usersListWithUsers = (sortOption, selectedFilteredGroups, users, numberGroups, numberUsers) => {
    const { usersState } = this.props;
    const sortFilteredUsers = this.sortedAndFilteredUsers(sortOption, selectedFilteredGroups, users);
    const showFilterSortHeader = !this.state.showingGroups && numberUsers > 0;

    return (
      <View style={{ flex: 1 }}>
        {showFilterSortHeader && this.sortFilterHeader()}
        <SwipeListView
          scrollEventThrottle={120}
          onScroll={this.onScroll}
          useFlatList
          ref={ref => this._swipeListUsersView = ref}
          data={sortFilteredUsers}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress = {() => {
                this.props.focusUser(item);
                this.props.focusGroup(item.primaryGroupName);
                this.props.navigation.navigate('UserScreen', {
                  fromGroupsScreen: 'true',
                });
              }}
              style={userContainerStyle}
              activeOpacity={0.5}
              underlayColor={colors.touchableHighlightUnderlayColor}
            >
              <FadeInOut
                style={{ flex: 1 }}
                _animated={item.animatedSlotOpacity}
              >
                <UserBox
                  username={item.name}
                  primaryGroupName={item.primaryGroupName}
                  userDescription={item.description}
                  date={parseToShortDate(item.createdDate)}
                />
              </FadeInOut>
            </TouchableHighlight>
          )}
          renderHiddenItem={data => (
            <View style={rowUserBack}>
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
          keyExtractor={(item => `${item.userID}`)}
          rightOpenValue={rightDrawerOpenValue}
          extraData={usersState}
          disableRightSwipe
        />
        { this.renderFooter(numberGroups, numberUsers) }
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
    this.props.addToast(`Sorting by ${sortOption}`, this.props.navigation.state.routeName);
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
    this.props.addToast('Applied Groups Filter', this.props.navigation.state.routeName);
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

  addGroupCB = () => {
    if (this._swipeListGroupsView) {
      this._swipeListGroupsView.safeCloseOpenRow();
    }
    this.props.navigation.navigate('AddGroupScreen');
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
      return this.groupsList(numberGroups, users, numberUsers);
    }
    return this.usersList(numberGroups, numberUsers, sortOption, selectedFilteredGroups, users);
  }

  renderFooter = (numberGroups, numberUsers) => {
    const { showingGroups, direction } = this.state;

    // viewing users and there are no groups
    if (!showingGroups && !numberGroups) {
      return null;
    }
  
    const showFooterButton = direction === 'up';
    // viewing users
    return (
      <Footer
        showAddUserButton={showFooterButton}
        addGroupCB={showingGroups ? this.addGroupCB : null}
        numberUsers={numberUsers}
        navigateToAddUserScreen={this.navigateToAddUserScreen}
        filterCB={this.openFilterModal}
        sortCB={this.openSortModal}
      />
    );
  }

  sortFilterHeader = () => {
    return (
      <View style={sortFilterRow}>
        <SortIcon
          sortCB={this.openSortModal}
        />
        <FilterIcon
          filterCB={this.openFilterModal}
        />
      </View>
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
      // we have our own type of custom container style (so scrollable list is entire horizontal screen)
      // when we have list of SOMETHING.
      <View style={container}>
        <View style={styles.contents}>
          {this.renderContents(numberGroups, users, numberUsers, sortOption, selectedFilteredGroups)}
        </View>
        {this.sortOpen()}
        {this.filterOpen()}
        {this.deleteGroupModal()}
        {this.deleteUserModal()}
        {this.checkErr(groupsStateErr)}
        <Toast
          ref={ele => this.toast = ele}
          style={toastWrapper}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // rowGroupBack needs to match groupContainer style, since rowGroupBack
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
  contents: {
    flex: 11,
  },
  noUsersContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    // because our container does not have padding bottom, we make it match paddingTop
    paddingBottom: container.paddingTop,
  },
  touchHereText: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    marginBottom: footerBottomDimensions.marginBottom,
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
    toastsState: state.toasts,
  }
);
const mapDispatchToProps = dispatch => (
  {
    clearToast: () => dispatch(clearToast()),
    addToast: (message, screenName) => dispatch(addToast(message, screenName)),
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

  addToast: PropTypes.func.isRequired,
  clearToast: PropTypes.func.isRequired,
  listGroups: PropTypes.func.isRequired,
  clearGroupsErr: PropTypes.func.isRequired,
  focusGroup: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  listAllUsers: PropTypes.func.isRequired,
  focusUser: PropTypes.func.isRequired,

  toastsState: PropTypes.shape({
    showingToast: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  groupsState: PropTypes.shape({
    groups: PropTypes.array,
    error: PropTypes.object,
  }).isRequired,
  usersState: PropTypes.shape({
    users: PropTypes.array,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
