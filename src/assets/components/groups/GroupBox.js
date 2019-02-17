import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { groupContainerStyle, groupTextStyle, groupIconNameContainer } from '../../styles/base';

import { getGroupColor } from '../../../lib/groupColors';

export default class Group extends React.Component {
  getCircularColorStyle(groupColor) {
    const circularGroupIconNoColor = styles.circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }

  render() {
    const { groupName, groups, firstTwoUsernames } = this.props;

    return (
      <View style={groupContainerStyle}>
        <View style={styles.groupIconNameContainer}>
          <View style={this.getCircularColorStyle(getGroupColor(groupName, groups))} />
          <Text style={styles.headerText} numberOfLines={1}>{groupName}</Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>{'\t'}{firstTwoUsernames[0]}</Text>
        <Text style={styles.text} numberOfLines={1}>{'\t'}{firstTwoUsernames[1]}</Text>
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
  circularGroupIcon: {
    height: wp('4%'),
    width: wp('4%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
    marginLeft: wp('2%'),
  },
  text: {
    fontSize: groupTextStyle.fontSize,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: groupTextStyle.fontSize,
  },
});
