import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { CheckBox } from 'react-native-elements';


import { checkBoxBase, groupIconNameContainer, groupIconContainer } from '../../styles/base';

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
    return (
      <CheckBox
        checked={group.added}
        checkedColor={colors.appThemeColor}
        onPress={() => cb(group.name)}
        containerStyle={{ padding: checkBoxBase.padding, margin: checkBoxBase.margin }}
      />
    );
  }

  render() {
    const { group } = this.props;
    return (
      <View>
        <TouchableHighlight
          onPress = {group.isFocusedGroup ? null : () => this.props.onGroupClick(group.name)}
          style={groupIconContainer}
          underlayColor="white"
        >
          <View style={this.props.innardsStyleContainer}>
            <View style={groupIconNameContainer}>
              <View style={this.props.getColorStyle(group.color, group.opacity)} />
              <Text numberOfLines={1}> {group.name} </Text>
            </View>
            {this.checkboxToRender(group, this.props.onGroupClick)}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
