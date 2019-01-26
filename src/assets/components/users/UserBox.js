import React from 'react';
import { connect } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Text, View, StyleSheet } from 'react-native';
import { getGroupColor } from '../../../lib/groupColors';

import { groupIconNameContainer } from '../../styles/base';

type Props = {
  username: string,
  userDescription: string,
  date: string,
  primaryGroupName: string, // this is optional, if you add it includes the groupColor
};

class UserBox extends React.Component <Props> {
  firstSectionWithGroup(primaryGroupName) {
    return (
      <View style={styles.groupIconNameContainer}>
        <View style={this.getCircularColorStyle(getGroupColor(primaryGroupName, this.props.groupsState.groups))} />
        <Text style={styles.headerText} numberOfLines={1}> {this.props.username} </Text>
      </View>
    );
  }

  firstSectionWithoutGroup() {
    return (
      <Text style={styles.headerText} numberOfLines={1}> {this.props.username} </Text>
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
      <View style={styles.container}>
        {this.props.primaryGroupName ? this.firstSectionWithGroup(this.props.primaryGroupName) : this.firstSectionWithoutGroup() }
        <View style={styles.descriptionAndDate}>
          <Text numberOfLines={1}> {this.props.userDescription} </Text>
          <Text numberOfLines={1}> {this.props.date} </Text>
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
    height: wp('4%'),
    width: wp('4%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
    marginLeft: wp('2%'),
  },
  groupIconNameContainer: {
    flex: groupIconNameContainer.flex,
    flexDirection: groupIconNameContainer.flexDirection,
    paddingTop: hp('0.5%'),
  },
  headerText: {
    fontWeight: 'bold',
  },
  container: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  descriptionAndDate: {
    flex: 1, // if uncomment, you'll see difference
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default connect(mapStateToProps)(UserBox);
