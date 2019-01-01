import React from 'react';
import { Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
            iconStyle={{
              padding: hp('1.5%'),
            }}
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption value='FAQ' text='FAQ' />
        </MenuOptions>
      </Menu>
    );
  }
}
