import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import {
  sortFilterWrapper,
  sortFilterIconText,
} from '../../styles/base';

import colors from '../../styles/colors';

export default class FilterIcon extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.filterCB}
      >
        <View style={sortFilterWrapper}>
          <Icon
            name='filter-list'
            color={colors.subTextColor}
          />
          <Text style={sortFilterIconText}>Filter</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
