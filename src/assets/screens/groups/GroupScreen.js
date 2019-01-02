import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';

import { listAllUsers, focusUser } from '../../../redux/actions/users';
import { container } from '../../styles/base';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';
import SortBy from '../../components/modal/SortBy';

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
      sortedUsersWrapper: {
        sortOption: 'Date: Old to New (default)',
        sortedUsers: this.usersForGroup(this.props.groupsState.focusedGroupName),
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

  sortOpen() {
    if (this.state.sortByModalOpen) {
      return (
        <SortBy
          sortOption={this.state.sortedUsersWrapper.sortOption}
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

  sortUsers(sortOption) {
    console.log('hi', sortOption);
    if (sortOption === 'Date: Old to New (default)') {
      console.log('1');
      this.setState((state) => {
        const copysortedUsers = state.sortedUsersWrapper.sortedUsers.slice();
        copysortedUsers.sort((a, b) => {
          // Turn strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          const aCreatedDate = new Date(a.createdDate);
          const bCreatedDate = new Date(b.createdDate);
          return aCreatedDate - bCreatedDate;
        });
        console.log('1sss', copysortedUsers);
        return {
          sortedUsersWrapper: {
            sortOption,
            sortedUsers: copysortedUsers,
          },
        };
      });
    }

    if (sortOption === 'Date: New to Old') {
      console.log('2');
      this.setState((state) => {
        const copysortedUsers = state.sortedUsersWrapper.sortedUsers.slice();
        copysortedUsers.sort((a, b) => {
          // Turn strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        console.log('2sss', copysortedUsers);
        return {
          sortedUsersWrapper: {
            sortOption,
            sortedUsers: copysortedUsers,
          },
        };
      });
    }

    if (sortOption === 'Alphabetical') {
      this.setState((state) => {
        const copysortedUsers = state.sortedUsersWrapper.sortedUsers.slice();
        copysortedUsers.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        console.log('33sss', copysortedUsers);
        return {
          sortedUsersWrapper: {
            sortOption,
            sortedUsers: copysortedUsers,
          },
        };
      });
    }
  }

  closeSortModal = (sortOption) => {
    this.setState({
      sortByModalOpen: false,
    });
    this.sortUsers(sortOption);
  }

  groupContents() {
    return (
      <FlatList
        data={this.state.sortedUsersWrapper.sortedUsers}
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
            openSortModal={this.openSortModal}
          />
        </View>
        {this.sortOpen()}
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
