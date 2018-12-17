import React from 'react';
import { Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default class GroupMenu extends React.Component {
  render() {
    return (
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
    );
  }
}
