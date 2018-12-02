import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { CheckBox } from 'react-native-elements';

import colors from '../../styles/colors';

type Props = {
  group: Object,
  onGroupClick: () => void,
  innardsStyleContainer: Object,
  getColorStyle: (String, Boolean, Object) => Object,
};

/**
 * NOTE: had to use touchable highlight instead of touchable opacity because of
 * https://github.com/styled-components/styled-components/issues/1795.
 * NOTE: touchable highlight must take one and only 1 child, hence view wrapper
 */
export default class AddGroup extends React.Component <Props> {
  checkboxToRender(group, cb) {
    if (group.isFocusedGroup) {
      return (
        <CheckBox
          checked
          checkedColor='grey'
          onPress={() => cb(group.name)}
        />
      );
    }
    return (
      <CheckBox
        checked={group.added}
        checkedColor={colors.appThemeColor}
        onPress={() => cb(group.name)}
      />
    );
  }

  render() {
    const { group } = this.props;
    return (
      <View>
        <TouchableHighlight
          style={this.props.getColorStyle(group.color, group.opacity, group)}
          onPress = {() => this.props.onGroupClick(group.name)}
        >
          <View style={this.props.innardsStyleContainer}>
            <Text> {group.name} </Text>
            {this.checkboxToRender(group, this.props.onGroupClick)}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
