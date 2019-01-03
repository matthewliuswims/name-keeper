import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';

import { listAllUsers, focusUser } from '../../../redux/actions/users';
import { container } from '../../styles/base';

import UserBox from '../../components/users/UserBox';

import { usersGroupNamesMatch } from '../../../lib/actions';

import Footer from '../../components/footer/footer';
import SortBy from '../../components/modal/SortBy';
import Filter from '../../components/modal/Filter';

import RightHeaderComponent from '../../components/headers/RightGroupHeader';

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
      filterModalOpen: false,
      sortedFilteredUsersWrapper: {
        // computed data shouldn't be stored in the state of the object, which is why sortedFiltererdUsers isn't here
        sortOption: 'Date: Old to New (default)',
        selectedFilteredGroups: this.filteredGroupsInitial(this.props.groupsState.groups, this.props.groupsState.focusedGroupName),
      },
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('groupName', 'GroupScreen'),
      headerRight: <RightHeaderComponent />,
    };
  };

  /**
   * this is necessary to update the usersList after we add a user (as the constructor is NOT
   * invoked after we add a user)
   */
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props)
    // @tutorial: https://reactjs.org/docs/react-component.html componentDidUpdate
    if (this.props.usersState !== prevProps.usersState) {
      this.setState({
        sortedFilteredUsersWrapper: {
          sortOption: 'Date: Old to New (default)',
          selectedFilteredGroups: this.filteredGroupsInitial(this.props.groupsState.groups, this.props.groupsState.focusedGroupName),
        },
      });
    }
  }

  /**
   * CALLED in constructor and in componentDidMount
   * @param groupsOriginal - this.props.groups, redux state of groups
   * @param focusedGroupname - group we are currently looking at
   * @return takes on form of Array of objects - where each object is a redux group WITH added fields
   * the added fields can be of form: added: true, opacity: 1, isFocusedGroup: true. In this case,
   * we return an array of groupWrappers, where the first group is the focused group & the others after
   * are unfocused.
   *
   * NOTE: the focused group is ALWAYS first & all groups by default have added to be true and opacity of 1,
   * which means they're all part of the filter (by default)
   */
  filteredGroupsInitial(groups, focusedGroupName) {
    console.log('inside initial groups r', groups);
    console.log('inside focusedGroupName r', focusedGroupName);
    let focusedGroup;

    const withFocus = groups.map((group) => {
      const clonedGroupTarget = Object.assign({}, group);
      if (group.name !== focusedGroupName) {
        const unfocusedGroup = Object.assign(clonedGroupTarget, { added: true, opacity: 1 });
        return unfocusedGroup;
      }
      focusedGroup = Object.assign(clonedGroupTarget, { added: true, opacity: 1, isFocusedGroup: true });
      return focusedGroup;
    });

    const noFocusGroup = withFocus.filter(group => group.name !== focusedGroupName);

    noFocusGroup.unshift(focusedGroup); // NOTE: HERE we make focused group first
    const filteredGroups = noFocusGroup;
    return filteredGroups;
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

  sortedAndFilteredUsers(sortOption, selectedFilteredGroups, users) {
    console.log('upper echelon selectedFilteredGroups', selectedFilteredGroups);
    const usersCopy = users.slice();
    const sortedUsers = this.sortUsers(sortOption, usersCopy);
    const sortAndFilteredUsers = this.filterUsers(selectedFilteredGroups, sortedUsers);
    return sortAndFilteredUsers;
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

  filterOpen() {
    if (this.state.filterModalOpen) {
      return (
        <Filter
          closeFilterModal={this.closeFilterModal}
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

  closeFilterModal = (filteredGroups) => {
    console.log('filtered gourps are', filteredGroups);
    this.setState({
      filterModalOpen: false,
    });
    this.setNewFiltereredGroups(filteredGroups);
  }

  setNewFiltereredGroups(changedGroups) {
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

  filterUsers(selectedFilteredGroups, users) {
    console.log('selectedFilteredGroups', selectedFilteredGroups);
    const filteredGroups = selectedFilteredGroups.filter(group => group.added);
    const filteredGroupNames = filteredGroups.map(group => group.name);
    const filteredUsers = usersGroupNamesMatch(filteredGroupNames, users);
    console.log('filteredUsers', filteredUsers);
    return filteredUsers;
  }

  sortOpen() {
    if (this.state.sortByModalOpen) {
      return (
        <SortBy
          sortOption={this.state.sortedFilteredUsersWrapper.sortOption}
          closeSortModal={this.closeSortModal}
        />
      );
    }
  }

  openSortModal = () => {
    this.setState({
      sortByModalOpen: true,
    });
  }

  closeSortModal = (sortOption) => {
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

  groupContents(groupName) {
    const { sortOption, selectedFilteredGroups } = this.state.sortedFilteredUsersWrapper;
    return (
      <FlatList
        data={this.sortedAndFilteredUsers(sortOption, selectedFilteredGroups, this.usersForGroup(groupName))}
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


  render() {
    const groupName = this.props.groupsState.focusedGroupName;
    const NumUsersForGroup = this.usersForGroup(groupName).length;
    return (
      <View style={styles.container}>
        <View style={styles.groupContents}>
          {NumUsersForGroup ? this.groupContents(groupName) : this.noGroupContents()}
        </View>
        <View style={styles.footer}>
          <Footer
            openFilterModal={this.openFilterModal}
            openSortModal={this.openSortModal}
          />
        </View>
        {this.sortOpen()}
        {this.filterOpen()}
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
  },
  groupContents: {
    paddingLeft: container.paddingLeft,
    paddingRight: container.paddingRight,
    flex: 11,
  },
  footer: {
    flex: 1,
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
