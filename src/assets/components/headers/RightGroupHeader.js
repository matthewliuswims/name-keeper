import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import GroupMenu from '../menus/GroupMenu';
// @TODO: have 2 icons here...and give EACH a CB
// is class currently because eventually will have state
export default class RightHeaderGroupComponent extends React.Component {
  state = { opened: false };

  onOptionSelect = (value) => {
    // alert(`Selected number: ${value}`);
    if (value === 1) {
      console.log('1 was selected');
    }
    if (value === 2) {
      console.log('2 was selected');
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
