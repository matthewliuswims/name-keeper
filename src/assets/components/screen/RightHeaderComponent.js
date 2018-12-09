import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

// @TODO: have 2 icons here...and give EACH a CB
// is class currently because eventually will have state
export default class RightHeaderComponent extends React.Component {
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
        <Menu>
          <MenuTrigger>
            <Icon
              name='more-vert'
              color='white'
              // SIZE?
            />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Save`)} text='Save' />
            <MenuOption onSelect={() => alert(`Delete`)} >
              <Text style={{color: 'red'}}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
          </MenuOptions>
        </Menu>
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
