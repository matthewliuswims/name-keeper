import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';
import GroupsDB from '../../database/GroupsDB';

type Props = {
  navigation: () => void,
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

export default class GroupsScreen extends Component<Props> {
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
    console.log('updatelistgroups', this.groupsDB.listGroups());
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
          onPress = {this.updateGroupsList}
          title = 'List groups'
        />

      </View>
    );
  }
}
