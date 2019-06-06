import React from 'react';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import { headerButtonWrapper } from '../../styles/base';

export default class GroupMenu extends React.Component {
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
            iconStyle={[headerButtonWrapper, { marginLeft: 8, marginRight: 6 }]}
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption value='About' text='About' />
        </MenuOptions>
      </Menu>
    );
  }
}
