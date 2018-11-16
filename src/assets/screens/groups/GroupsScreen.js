import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';
import ErrorModal from '../../components/modal/Error';

import { listGroups, clearGroupsErr } from '../../../redux/actions/groups';
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
    console.log('groups screen created');
    super(props);
    this.props.listGroups();
  }

  static navigationOptions = {
    title: 'Groups',
    headerRight: <RightHeaderComponent />,
  };

  updateGroupsList = () => {
    this.props.listGroups();
  }

  noAmpersands = (err) => {
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

  render() {
    const { error: groupsStateErr } = this.props.groupsState;

    return (
      <View style={styles.container}>
        {!this.props.groupsState.loading && (
        <FlatList
          data={this.props.groupsState.groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress = {() => this.props.navigation.navigate('GroupScreen')}
            >
              <Group
                style={styles.item}
                groupName={item.name}
                firstUsername = 'asd' // @TODO: get usernames from redux state, who have latest edit date
                secondUsername = 'asd'
                />
            </TouchableOpacity>
          )}
          keyExtractor={(item => `${item.group_id}`)}
        />) }
        <Button
          onPress = {() => this.props.navigation.navigate('UsersScreen',
            {
              id: 86,
              details: 'yeah',
            })}
          title = 'Go to users screen'
        />
        <TouchableOpacity
          style={styles.button}
          onPress = {() => this.props.navigation.navigate('AddGroupScreen')}
        >
          <Text> Add Group </Text>
        </TouchableOpacity>
        <Button
          onPress = {this.updateGroupsList}
          title = 'List groups'
        />
        {this.noAmpersands(groupsStateErr)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    paddingLeft: container.paddingLeft,
    paddingRight: container.paddingRight,
    backgroundColor: container.backgroundColor,
  },
  // PUT BUTTON IN SEPARATE LOGIC
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#979797',
    shadowColor: '#979797',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
});

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);
const mapDispatchToProps = dispatch => (
  {
    listGroups: () => dispatch(listGroups()),
    clearGroupsErr: () => dispatch(clearGroupsErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
