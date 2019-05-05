import React from 'react';
import { Text, View } from 'react-native';

import { groupTextStyle, groupIconNameContainer, groupColorBoxSliverLeftSide, groupBoxContainer, rightSideGroupBox, groupHeaderTextStyle } from '../../styles/base';

import { getGroupColor } from '../../../lib/groupColors';

export default class Group extends React.Component {
  getVerticalStrip(groupColor) {
    const bgColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = [groupColorBoxSliverLeftSide, bgColor];
    return combinedStyle;
  }

  showUserNamesText(userNamesForGroup) {
    if (userNamesForGroup.length === 0) {
      return (
        <Text style={groupTextStyle} numberOfLines={1}>No People in Group</Text>
      );
    }
    return (
      <Text style={groupTextStyle} numberOfLines={1}>{this.usersTextDisplay(userNamesForGroup)}</Text>
    );
  }

  usersTextDisplay(userNamesForGroup) {
    if (userNamesForGroup.length === 1) {
      return `${userNamesForGroup[0]}`;
    }
    if (userNamesForGroup.length === 2) {
      return `${userNamesForGroup[0]} and ${userNamesForGroup[1]}`;
    }
    const remainderUsers = userNamesForGroup.length - 2;
    return `${userNamesForGroup[0]}, ${userNamesForGroup[1]} and ${remainderUsers} more`;
  }

  render() {
    const { groupName, groups, userNamesForGroup } = this.props;

    return (
      <View style={groupBoxContainer}>
        <View style={this.getVerticalStrip(getGroupColor(groupName, groups))} />
        <View style={rightSideGroupBox}>
          <View style={groupIconNameContainer}>
            <Text style={groupHeaderTextStyle} numberOfLines={1}>{groupName}</Text>
          </View>
          {this.showUserNamesText(userNamesForGroup)}
        </View>
      </View>
    );
  }
}
