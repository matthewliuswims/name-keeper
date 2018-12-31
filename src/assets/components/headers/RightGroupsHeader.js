import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import GroupsMenu from '../menus/GroupsMenu';

class RightGroupsHeader extends React.Component {
  state = { opened: false };

  onOptionSelect = (value) => {
    if (value === 'FAQ') {
      console.log('faq was called');
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
      <View style={styles.container}>
        <Icon
          onPress={() => {
            this.props.navigation.navigate('SearchScreen', {
              groupName: '', // we are groups, and so we don't have a groupName
            });
          }}
          name='search'
          underlayColor='grey'
          color='white'
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


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default withNavigation(connect(mapStateToProps)(RightGroupsHeader));
