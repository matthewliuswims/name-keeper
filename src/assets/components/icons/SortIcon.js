import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import {
  sortFilterWrapper,
  sortFilterIconText,
} from '../../styles/base';

import colors from '../../styles/colors';

export default class SortIcon extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.sortCB}
      >
        <View style={sortFilterWrapper}>
          <Icon
            name='sort'
            color={colors.subTextColor}
          />
          <Text style={sortFilterIconText}>Sort</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
