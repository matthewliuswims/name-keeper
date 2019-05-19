import React from 'react';
import { connect } from 'react-redux';

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

class UserBox extends React.Component {
  userDescriptions(userDescriptionArray) {
    // const withDashArray = userDescriptionArray.map(descriptor => `- ${descriptor} `);
    const descriptionString = userDescriptionArray.join(' - ');
    return descriptionString;
  }

  groupAndDate = () => {
    return (
      <View style={groupIconNameDateContainer}>
        <Text style={boxHeaderText} numberOfLines={1}>{this.props.username} </Text>
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
    const { primaryGroupName } = this.props;
    return (
      <View style={userBoxContainer}>
        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <View style={this.getCircularColorStyle(getGroupColor(primaryGroupName, this.props.groupsState.groups))} />
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {this.groupAndDate()}
          <View style={boxDescription}>
            <Text numberOfLines={1} style={userDescriptionText}>{this.userDescriptions(this.props.userDescription)} </Text>
          </View>
        </View>
      </View>
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
});

export default connect(mapStateToProps)(UserBox);
