import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { get } from 'lodash';

import { Text, View, StyleSheet, FlatList } from 'react-native';
import moment from 'moment';

import { container, groupIconNameContainer, horizontalGroupScreenButton } from '../../styles/base';
import RightHeaderComponent from '../../components/headers/RightUserHeader';
import { getGroupColor } from '../../../lib/groupColors';

class UserScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('username'),
      headerRight: <RightHeaderComponent />,
      headerBackTitle: null,
    };
  };

  parseDate(dateAsStr) {
    const momentDate = moment(dateAsStr);
    const formattedDate = momentDate.format('h:mm A, dddd, MMMM Do, YYYY');
    return formattedDate;
  }

  getCircularColorStyle(groupColor) {
    const circularGroupIconNoColor = styles.circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }

  groupTagNamesOnly(threeGroupNames) {
    const groupTagNames = threeGroupNames.filter((groupName) => {
      return groupName !== this.props.groupsState.focusedGroupName;
    });
    return groupTagNames;
  }


  render() {
    const { usersState } = this.props;
    const { groupsState } = this.props;

    const { groups } = groupsState;
    const user = usersState.focusedUser;
    const userGroups = get(user, 'groupNames', null);

    return (
      <View style={styles.containerWrapper}>
        { user
        && (
          <View style={container}>
            <View style={styles.infoRow}>
              <Icon
                name='date-range'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <Text style={styles.rightColumn}>{this.parseDate(user.lastEdit)}</Text>
            </View>
            {user.location
            && (
              <View style={styles.infoRow}>
                <Icon
                  name='location-on'
                  containerStyle={{ marginRight: wp('5%') }}
                />
                <Text style={styles.rightColumn}>{user.location}</Text>
              </View>
            )
            }
            <View style={styles.groupsSection}>
              <Icon
                name='group'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <FlatList
                data={[this.props.groupsState.focusedGroupName]}
                renderItem={({ item }) => (
                  <View style={styles.groupIconNameContainer}>
                    <View style={this.getCircularColorStyle(getGroupColor(item, groups))} />
                    <Text> {item} </Text>
                  </View>
                )
                }
                keyExtractor={(item => item)}
              />
            </View>
            {userGroups.length > 1
            && (
            <View style={styles.groupsSection}>
              <Icon
                name='label'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <FlatList
                data={this.groupTagNamesOnly(userGroups)}
                renderItem={({ item }) => (
                  <View style={styles.groupIconNameContainer}>
                    <View style={this.getCircularColorStyle(getGroupColor(item, groups))} />
                    <Text> {item} </Text>
                  </View>
                )
                }
                keyExtractor={(item => item)}
              />
            </View>
            )
            }
            <View style={styles.description}>
              <Text> {user.description} </Text>
            </View>
          </View>
        )
          }
      </View>
    );
  }
}

/**
 * NOTICE: infoRow is not given a flex: 1, because we don't want it to expand down.
 */
const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  groupIconNameContainer: {
    flex: groupIconNameContainer.flex,
    flexDirection: groupIconNameContainer.flexDirection,
    paddingTop: hp('0.5%'),
  },
  groupsSection: {
    flexDirection: 'row',
    marginTop: hp('3%'),
  },
  rightColumn: {
    paddingTop: hp('0.5%'),
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: hp('3%'),
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'center',

    paddingLeft: wp('4%'),
    paddingRight: wp('4%'),
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    paddingTop: hp('4%'),
    paddingBottom: hp('4%'),
    marginTop: hp('7%'),

    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
    shadowColor: horizontalGroupScreenButton.shadowColor,
  },
  circularGroupIcon: {
    height: wp('4%'),
    width: wp('4%'),
    borderRadius: wp('3%'),
    marginRight: wp('3%'),
  },
});

const mapStateToProps = state => (
  {
    usersState: state.users,
    groupsState: state.groups,
  }
);

export default connect(mapStateToProps)(UserScreen);
