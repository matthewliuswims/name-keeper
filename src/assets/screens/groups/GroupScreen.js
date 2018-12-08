// @flow

import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { connect } from 'react-redux';
import { get } from 'lodash';

import { listAllUsers, focusUser } from '../../../redux/actions/users';
import { container } from '../../styles/base';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';


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
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('groupName', 'GroupScreen'),
    };
  };

  /**
   * will only get the users where user.groupNameOne === groupName
   * @param {string} groupName
   */
  usersForGroup(groupName) {
    const { users } = this.props.usersState;
    if (!users) return;
    const usersInGroup = this.props.usersState.users.filter((user) => {
      return user.groupNameOne === groupName;
    });
    return usersInGroup;
  }

  parseDate(dateAsStr) {
    const momentDate = moment(dateAsStr);
    const formattedDate = momentDate.format('ddd, MMM Mo');
    return formattedDate;
  }


  render() {
    const groupName = get(this.props.groupsState, 'focusedGroupName', null);
    return (
      <View style={styles.container}>
        <View style={styles.groupContents}>
          <FlatList
            data={this.usersForGroup(groupName)}
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
                  date={this.parseDate(item.createdDate)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item => `${item.userID}`)}
          />
        </View>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
