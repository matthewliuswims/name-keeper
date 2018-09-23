import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';
import ErrorModal from '../../components/modal/Error';
import GroupsDB from '../../database/GroupsDB';

type Props = {
  navigation: () => void,
  groupsState : {
    error: Object,
  }
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
  },
});

class GroupsScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.groupsDB = GroupsDB.getInstance();
    this.state = {
      groups: [
        { key: 'Work' },
        { key: 'Jazz Band' },
        { key: 'Swimming' },
        { key: '1' },
        { key: '2' },
        { key: '3' },
        { key: '4' },
        { key: '5' },
        { key: '6' },
        { key: '7' },
        { key: '8' },
        { key: '9' },
      ],
    };
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
    this.groupsDB.listGroups();
  }

  render() { // make flat list it's own component
  // TODO: how to pass something without invoking callback?
    return (
      <View style={styles.container}>
        <Text>Groups Screen hi yahz</Text>
        <FlatList
          data={this.state.groups}
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        />
        <Button
          onPress = {() => this.props.navigation.navigate('UsersScreen',
            {
              id: 86,
              details: 'yeah',
            })}
          title = 'Go to users screen'
        />

        <Button
          onPress = {() => this.props.navigation.navigate('AddGroupScreen')}
          title = 'Go to add group screen'
        />

        <Button
          onPress = {this.updateGroupsList} // TODO: bug, why is this firing everytime? i click anywhere on screen
          title = 'List groups'
        />
        {this.props.groupsState.error && <ErrorModal message={this.props.groupsState.error.message} />}
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);


export default connect(mapStateToProps)(GroupsScreen);
