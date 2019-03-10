import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { groupTextStyle, groupIconNameContainer, groupColorBoxSliverLeftSide, groupBoxContainer, rightSideGroupBox } from '../../styles/base';

import { getGroupColor } from '../../../lib/groupColors';

export default class Group extends React.Component {
  getVerticalStrip(groupColor) {
    const bgColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = [groupColorBoxSliverLeftSide, bgColor];
    return combinedStyle;
  }

  showUserNamesText(firstTwoUsernames) {
    if (firstTwoUsernames.length === 0) {
      return (
        <Text style={styles.text} numberOfLines={1}>{'\t'}No People in Group</Text>
      );
    }
    return (
      <React.Fragment>
        <Text style={styles.text} numberOfLines={1}>{'\t'}{firstTwoUsernames[0]}</Text>
        <Text style={styles.text} numberOfLines={1}>{'\t'}{firstTwoUsernames[1]}</Text>
      </React.Fragment>
    );
  }

  render() {
    const { groupName, groups, firstTwoUsernames } = this.props;

    return (
      <View style={groupBoxContainer}>
        <View style={this.getVerticalStrip(getGroupColor(groupName, groups))} />
        <View style={rightSideGroupBox}>
          <View style={styles.groupIconNameContainer}>
            <Text style={styles.headerText} numberOfLines={1}>{groupName}</Text>
          </View>
          {this.showUserNamesText(firstTwoUsernames)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  groupIconNameContainer: {
    flex: groupIconNameContainer.flex,
    flexDirection: groupIconNameContainer.flexDirection,
    paddingTop: groupIconNameContainer.paddingTop,
    alignItems: groupIconNameContainer.alignItems,
    marginBottom: 4,
  },
  text: {
    fontSize: groupTextStyle.fontSize,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: groupTextStyle.fontSize,
  },
});
