import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import {
  sortFilterWrapper,
  sortFilterIconText,
  sortFilterIcon,
} from '../../styles/base';

import colors from '../../styles/colors';

export default class SortIcon extends React.Component {
  render() {
    return (
      <View style={sortFilterWrapper}>
        <Icon
          name='sort'
          color={colors.subTextColor}
          containerStyle={sortFilterIcon}
        />
        <Text style={sortFilterIconText}>Sort</Text>
      </View>
    );
  }
}
