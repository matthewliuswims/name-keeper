import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import GroupsMenu from '../menus/GroupsMenu';

import { twoItemHeaderContainer, headerButtonWrapper } from '../../styles/base';

class RightGroupsHeader extends React.Component {
  state = { opened: false };

  onOptionSelect = (value) => {
    if (value === 'About') {
      this.props.navigation.navigate('AboutScreen');
    }
  }

  onTriggerPress = () => {
    this.setState({ opened: true });
  }

  onBackdropPress = () => {
    this.setState({ opened: false });
  }

  render() {
    const { opened } = this.state;
    return (
      <View style={twoItemHeaderContainer}>
        <Icon
          onPress={() => {
            this.props.navigation.navigate('SearchScreen', {
              groupName: '', // we are groups, and so we don't have a groupName
            });
          }}
          name='search'
          underlayColor='grey'
          color='white'
          iconStyle={headerButtonWrapper}
        />
        <GroupsMenu
          opened={opened}
          onBackdropPress={this.onBackdropPress}
          onSelect={this.onOptionSelect}
          onTriggerPress={this.onTriggerPress}
        />
      </View>
    );
  }
}

export default withNavigation(RightGroupsHeader);
