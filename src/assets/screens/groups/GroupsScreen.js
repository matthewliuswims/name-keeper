import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { container, horizontalGroupScreenButton } from '../../styles/base';
import colors from '../../styles/colors';

import ErrorModal from '../../components/modal/Error';

import { listAllUsers } from '../../../redux/actions/users';

import { listGroups, clearGroupsErr, focusGroup } from '../../../redux/actions/groups';
import Group from '../../components/groups/GroupBox';

type Props = {
  navigation: () => void,
  listGroups: () => Promise<Object>,
  groupsState : {
    error: Object,
    groups: Array<Object>,
  }
};

class GroupsScreen extends Component<Props> {
  constructor(props) {
    console.log('groups screen created - only on opening of app??');
    super(props);
    this.props.listGroups();
    this.props.listAllUsers();
  }

  static navigationOptions = {
    title: 'Groups',
  };

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

  render() {
    const { error: groupsStateErr } = this.props.groupsState;
    const { users } = this.props.usersState;
    return (
      <View style={container}>
        {!this.props.groupsState.loading && (
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
        />) }
        <TouchableOpacity
          style={styles.button}
          onPress = {() => this.props.navigation.navigate('AddGroupScreen')}
        >
          <Text> Add Group </Text>
        </TouchableOpacity>
        {this.checkErr(groupsStateErr)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // PUT BUTTON IN SEPARATE LOGIC
  button: {
    backgroundColor: colors.addApplyColor,

    alignItems: horizontalGroupScreenButton.alignItems,
    padding: horizontalGroupScreenButton.padding,
    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
    shadowColor: horizontalGroupScreenButton.shadowColor,
    shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    shadowRadius: horizontalGroupScreenButton.shadowRadius,
    shadowOffset: horizontalGroupScreenButton.shadowOffset,
    paddingTop: horizontalGroupScreenButton.paddingTop,
    paddingBottom: horizontalGroupScreenButton.paddingBottom,
    marginBottom: horizontalGroupScreenButton.marginBottom,
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
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
