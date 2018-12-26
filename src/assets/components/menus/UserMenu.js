import React from 'react';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default class UserMenu extends React.Component {
  render() {
    return (
      <Menu
        opened={this.props.opened}
        onBackdropPress={() => this.props.onBackdropPress()}
        onSelect={value => this.props.onSelect(value)}>
        <MenuTrigger
          onPress={() => this.props.onTriggerPress()}
        >
          <Icon
            name='more-vert'
            color='white'
            // SIZE?
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption value='edit' text='edit' />
          <MenuOption value='delete' text='delete' />
        </MenuOptions>
      </Menu>
    );
  }
}
