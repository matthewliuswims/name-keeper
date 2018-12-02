// @flow

import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

import { connect } from 'react-redux';
import { get } from 'lodash';

import { listAllUsers } from '../../../redux/actions/users';
import { container } from '../../styles/base';

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

  static navigationOptions = {
    title: 'Group Screen',
    // header: ({ goBack }) => ({
    //   left: (<Ionicons name='chevron-left' onPress={() => { goBack(); }} />),
    // }),
  };

  // @TODO: USE LODASH GET BELOW INSTEAD OF THE &&
  usersForGroup(groupName) {
    const { users } = this.props.usersState;
    if (!users) return;
    const grpsUsers = this.props.usersState.users.filter((user) => {
      return user.groupNameOne === groupName;
    });
    return grpsUsers;
  }


  render() {
    const groupName = get(this.props.groupsState, 'focusedGroupName', null);
    return (
      <View style={styles.container}>
        <View style={styles.groupContents}>
          <FlatList
            data={this.usersForGroup(groupName)}
            renderItem={({ item }) => (
              <Text> {item.name} </Text>
            )}
            keyExtractor={(item => `${item.userID}`)}
          />
          <Text> {groupName} </Text>
        </View>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
  }
);

const mapDispatchToProps = dispatch => (
  {
    listAllUsers: () => dispatch(listAllUsers()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);


const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    backgroundColor: container.backgroundColor,
  },
  groupContents: {
    flex: 11,
  },
  footer: {
    flex: 1,
  },
});
