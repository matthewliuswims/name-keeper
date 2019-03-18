import React from 'react';
import { connect } from 'react-redux';

import { Text, View, StyleSheet } from 'react-native';
import { getGroupColor } from '../../../lib/groupColors';

import { groupIconNameContainer, circularGroupIcon, groupIconNameDateContainer, userDescriptionText } from '../../styles/base';

type Props = {
  username: string,
  userDescription: string,
  date: string,
  primaryGroupName: string, // this is optional, if you add it includes the groupColor
};

class UserBox extends React.Component <Props> {
  firstSectionWithGroup(primaryGroupName) {
    return (
      <View style={groupIconNameDateContainer}>
        <View style={groupIconNameContainer}>
          <View style={this.getCircularColorStyle(getGroupColor(primaryGroupName, this.props.groupsState.groups))} />
          <Text style={styles.headerText} numberOfLines={1}> {this.props.username} </Text>
        </View>
        <Text numberOfLines={1}> {this.props.date} </Text>
      </View>
    );
  }

  firstSectionWithoutGroup() {
    return (
      <View style={groupIconNameDateContainer}>
        <Text style={styles.headerText} numberOfLines={1}>{this.props.username} </Text>
        <Text numberOfLines={1}> {this.props.date} </Text>
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
    return (
      <React.Fragment>
        {this.props.primaryGroupName ? this.firstSectionWithGroup(this.props.primaryGroupName) : this.firstSectionWithoutGroup() }
        <View style={styles.descriptionAndDate}>
          <Text numberOfLines={1} style={userDescriptionText}>{this.props.userDescription} </Text>
        </View>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

const styles = StyleSheet.create({
  circularGroupIcon: {
    height: circularGroupIcon.height,
    width: circularGroupIcon.width,
    borderRadius: circularGroupIcon.borderRadius,
    marginRight: circularGroupIcon.marginRight,
    // we do NOT get margin left from circularGroupIcon
  },
  headerText: {
    fontWeight: '600',
  },
  descriptionAndDate: {
    flex: 1, // if uncomment, you'll see difference
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default connect(mapStateToProps)(UserBox);
