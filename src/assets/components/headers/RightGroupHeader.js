import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import GroupMenu from '../menus/GroupMenu';
// @TODO: have 2 icons here...and give EACH a CB
// is class currently because eventually will have state
export default class RightHeaderGroupComponent extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon
          onPress={() => console.log('HIII')}
          name='search'
          underlayColor='grey'
          color='white'
          // SIZE?
        />
        <GroupMenu />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
