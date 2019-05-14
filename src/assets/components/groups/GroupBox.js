import React from 'react';
import { Icon } from 'react-native-elements';
import { Text, View, StyleSheet } from 'react-native';
import { getGroupColor } from '../../../lib/groupColors';

import {
  circularGroupIcon,
  groupIconNameDateContainer,
  userDescriptionText,
  boxDescription,
  boxHeaderText,
  boxDateText,
  userBoxContainer,
} from '../../styles/base';

export default class GroupBox extends React.Component {
  groupDescriptions(userNamesForGroup) {
    if (userNamesForGroup.length === 0) {
      return (
        <Text style={userDescriptionText} numberOfLines={1}>No People in Group</Text>
      );
    }
    return (
      <Text style={userDescriptionText} numberOfLines={1}>{this.usersTextDisplay(userNamesForGroup)}</Text>
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

  groupAndDate = () => {
    return (
      <View style={groupIconNameDateContainer}>
        <Text style={boxHeaderText} numberOfLines={1}>{this.props.groupName} </Text>
        <Text style={boxDateText}> {this.props.date} </Text>
      </View>
    );
  }

  getCircularColorStyle(groupColor) {
    const circularGroupIconNoColor = styles.circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }

  render() {
    const { groupName, groups, userNamesForGroup } = this.props;

    return (
      <View style={userBoxContainer}>
        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <Icon
            name='group'
            color={getGroupColor(groupName, groups)}
            size={circularGroupIcon.height * 1.5}
            iconStyle={{ marginRight: circularGroupIcon.marginRight }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {this.groupAndDate()}
          <View style={boxDescription}>
            <Text numberOfLines={1} style={userDescriptionText}>{this.groupDescriptions(userNamesForGroup)} </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circularGroupIcon: {
    height: circularGroupIcon.height,
    width: circularGroupIcon.width,
    borderRadius: circularGroupIcon.borderRadius,
    marginRight: circularGroupIcon.marginRight,
    // we do NOT get margin left from circularGroupIcon
  },
});
