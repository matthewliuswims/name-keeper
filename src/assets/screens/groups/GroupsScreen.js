import Sentry from 'sentry-expo';

import React, { Component, Fragment } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import RF from 'react-native-responsive-fontsize';
import { get } from 'lodash';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { container, horizontalGroupScreenButton, footerSection } from '../../styles/base';
import colors from '../../styles/colors';

import Footer from '../../components/footer/footer';

import ErrorModal from '../../components/modal/Error';

import { listAllUsers, focusUser } from '../../../redux/actions/users';

import { listGroups, clearGroupsErr, focusGroup } from '../../../redux/actions/groups';
import Group from '../../components/groups/GroupBox';
import RightHeaderComponent from '../../components/headers/RightGroupsHeader';
import LeftHeaderComponent from '../../components/headers/LeftGroupsHeader';

import { parseToShortDate } from '../../../lib/dates';
import UserBox from '../../components/users/UserBox';

import { usersGroupNamesMatch } from '../../../lib/actions';

import SortBy from '../../components/modal/SortBy';
import Filter from '../../components/modal/Filter';


type Props = {
  navigation: () => void,
  listGroups: () => Promise<Object>,
  groupsState : {
    error: Object,
    groups: Array<Object>,
  }
};

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class GroupsScreen extends Component<Props> {
  constructor(props) {
    Sentry.captureMessage('Groups screen Initialzied for a user', {
      level: 'info', // one of 'info', 'warning', or 'error'
    });
    super(props);
    this.props.listGroups(); // also called in compoenntDidMount, but this is used so we can see groups quicker on screen
    this.props.listAllUsers();
    this.state = {
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

  componentDidMount() {
    const { showingGroups, screenTitle } = this.state;
    this.props.navigation.setParams({ screenTitle });
    this.props.navigation.setParams({ showingGroups });
    this.props.navigation.setParams({ swap: this.swap });
    this.props.navigation.setParams({ getTotalNumberUsers: this.getTotalNumberUsers });

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

  getTwoUsernames(groupName, users) {
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

  groups = (users) => {
    return (
      !this.props.groupsState.loading && (
        <FlatList
          data={this.props.groupsState.groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress = {() => {
                this.props.focusGroup(item.name);
                this.props.navigation.navigate('GroupScreen',
                  {
                    groupName: item.name,
                  });
              }}
            >
              <Group
                groupName={item.name}
                firstTwoUsernames={this.getTwoUsernames(item.name, users)}
                />
            </TouchableOpacity>
          )}
          keyExtractor={(item => `${item.groupID}`)}
          extraData={this.props.usersState} // necessary to show the 2 users
        />)
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
            {'Click "Groups" at the top left & go create a group'}
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
    const sortFilteredUsers = this.sortedAndFilteredUsers(sortOption, selectedFilteredGroups, users);
    return (
      <Fragment>
        <Text style={styles.usersListText}> Everyone in all groups </Text>
        <FlatList
          data={sortFilteredUsers}
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
                primaryGroupName={item.primaryGroupName}
                userDescription={item.description}
                date={parseToShortDate(item.createdDate)}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item => `${item.userID}`)}
        />
      </Fragment>
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
      <View style={styles.button} elevation={5}>
        <TouchableOpacity
          onPress = {() => {
            this.props.navigation.navigate('AddGroupScreen');
          }
          }
        >
          <Text style={styles.addText}>+ <Text style={styles.groupText}> group</Text></Text>
        </TouchableOpacity>
      </View>
    );
  }

  navigateToAddUserScreen = () => {
    const firstGroupNameWeFind = get(this.props.groupsState, 'groups[0].name', '');
    if (!firstGroupNameWeFind) {
      Sentry.captureException(new Error('Catastrophic Error: tried to add a user, but could not get a default group to give that user'));
    }
    this.props.focusGroup(firstGroupNameWeFind); // arbitrarily focus the first group name we find
    this.props.navigation.navigate('AddUserScreen');
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
    const { error: groupsStateErr, groups } = this.props.groupsState;
    const { users } = this.props.usersState;
    const { sortOption, selectedFilteredGroups } = this.state.sortedFilteredUsersWrapper;

    const numberGroups = groups.length;
    const numberUsers = users.length;
    return (
      <View style={styles.container}>
        <View style={styles.contents}>
          { this.renderContents(numberGroups, users, numberUsers, sortOption, selectedFilteredGroups)}
        </View>
        <View style={footerSection}>
          { this.renderFooter(numberGroups, numberUsers) }
        </View>
        {this.sortOpen()}
        {this.filterOpen()}
        {this.checkErr(groupsStateErr)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addText: {
    fontWeight: 'bold',
    fontSize: hp('3%'),
    color: 'white',
  },
  groupText: {
    fontSize: hp('2.75%'),
    fontWeight: 'bold',
    color: 'white',
  },
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
  noGroupsOrUsersHeader: {
    fontWeight: 'bold',
    fontSize: RF(4),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  usersListText: {
    fontWeight: 'bold',
    fontSize: RF(3),
    textAlign: 'center',
    marginBottom: hp('2%'),
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
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: horizontalGroupScreenButton.alignItems,
    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
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
    clearGroupsErr: () => dispatch(clearGroupsErr()),
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    listAllUsers: () => dispatch(listAllUsers()),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
