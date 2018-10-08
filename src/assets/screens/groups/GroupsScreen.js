import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';
import ErrorModal from '../../components/modal/Error';
import GroupsDB from '../../database/GroupsDB';

import { listGroups } from '../../../redux/actions/groups';
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
    super(props);
    this.groupsDB = GroupsDB.getInstance();
    this.props.listGroups();
  }

  static navigationOptions = {
    title: 'Groups',
    headerRight: <RightHeaderComponent />,
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  updateGroupsList = () => {
    this.props.listGroups();
  }

  render() {
    return (
      <View style={styles.container}>
        { !this.props.groupsState.loading && (
        <FlatList
          data={this.props.groupsState.groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress = {() => this.props.navigation.navigate('GroupScreen')}
            >
              <Group
                style={styles.item}
                groupName={item.name}
                firstUsername = 'asd' // @TODO: get usernames from redux state
                secondUsername = 'asd'
                />
            </TouchableOpacity>
          )}
          keyExtractor={(item => `${item.id}`)}
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
        {this.props.groupsState.error && <ErrorModal message={this.props.groupsState.error.message} />}
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
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
