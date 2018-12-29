import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import GroupMenu from '../menus/GroupMenu';
import deleteGroup from '../../../redux/actions/groups';


class RightHeaderGroupComponent extends React.Component {
  state = { opened: false };

  onOptionSelect = (value) => {
    if (value === 'edit') {
      console.log('edit group');
      this.props.navigation.navigate('EditGroupScreen', {
        focusedGroupName: this.props.groupsState.focusedGroupName,
      });
    }
    if (value === 'delete') {
      console.log('2 was selected');
      /*
       *  1.25) call redux action for delete
       *  1.5) react navigation change screen.
       */
    }
    this.setState({ opened: false });
  }

  onTriggerPress = () => {
    this.setState({ opened: true });
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  onBackdropPress = () => {
    this.setState({ opened: false });
  }

  render() {
    const { opened } = this.state;
    return (
      <View style={styles.container}>
        <Icon
          onPress={() => console.log('HIII')}
          name='search'
          underlayColor='grey'
          color='white'
          // SIZE?
        />
        <GroupMenu
          opened={opened}
          onBackdropPress={this.onBackdropPress}
          onSelect={this.onOptionSelect}
          onTriggerPress={this.onTriggerPress}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});


const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);
const mapDispatchToProps = dispatch => (
  {
    deleteGroup: groupName => dispatch(deleteGroup(groupName)),
  }
);

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RightHeaderGroupComponent));
