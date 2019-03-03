import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import { twoItemHeaderContainer, headerButtonWrapper } from '../../styles/base';

import RightTextHeader from './RightTextHeader';

class RightHeaderGroupComponent extends React.Component {
  render() {
    return (
      <View style={twoItemHeaderContainer}>
        <Icon
          onPress={() => {
            this.props.navigation.navigate('SearchScreen', {
              groupName: this.props.groupsState.focusedGroupName,
            });
          }}
          name='search'
          underlayColor='grey'
          color='white'
          iconStyle={headerButtonWrapper}
        />
        <View style={headerButtonWrapper}>
          <RightTextHeader
            buttonOnPress={() => {
              this.props.navigation.navigate('EditGroupScreen');
            }}
            textDisplay='Edit'
            soleDisplay={false}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default withNavigation(connect(mapStateToProps)(RightHeaderGroupComponent));
