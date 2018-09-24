import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';
import ErrorModal from '../../components/modal/Error';
import GroupsDB from '../../database/GroupsDB';

import { listGroups } from '../../../redux/actions/groups';

type Props = {
  navigation: () => void,
  listGroups: () => Promise<Object>,
  groupsState : {
    error: Object,
    groups: Array<Object>,
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
    this.props.listGroups().catch(() => {
      // redux will already have error, which will boil error up to UI via modal
    });
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
    this.props.listGroups().catch(() => {
      // redux will already have error, which will boil error up to UI via modal
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Groups Screen hi yahz</Text>
        { !this.props.groupsState.loading && (
        <FlatList
          data={this.props.groupsState.groups}
          renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
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

        <Button
          onPress = {() => this.props.navigation.navigate('AddGroupScreen')}
          title = 'Go to add group screen'
        />

        <Button
          onPress = {this.updateGroupsList}
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
const mapDispatchToProps = dispatch => (
  {
    listGroups: () => dispatch(listGroups()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
