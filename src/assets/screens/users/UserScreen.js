import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { get } from 'lodash';

import { Text, View, StyleSheet } from 'react-native';

import noOp from '../../../lib/UIhelpers';
import { container, groupIconNameContainer, horizontalGroupScreenButton, circularGroupIcon } from '../../styles/base';
import RightHeaderComponent from '../../components/headers/RightTextHeader';
import { getGroupColor } from '../../../lib/groupColors';


class UserScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({ username: this.props.usersState.focusedUser.name });
  }

  static navigationOptions = ({ navigation }) => {
    const username = navigation.getParam('username') || '';
    return {
      title: username,
      headerRight: <RightHeaderComponent
        buttonOnPress={navigation.getParam('editClick') || noOp}
        textDisplay='Edit'
      />,
      headerBackTitle: null,
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ editClick: this.editClick });
  }

  editClick = () => {
    this.props.navigation.navigate('EditUserScreen', {
      focusedUserName: this.props.usersState.focusedUser.name,
    });
  }

  getCircularColorStyle(groupColor) {
    const circularGroupIconNoColor = styles.circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }

  /**
   * not quite the same as UserBox userDescriptions.
   * notice the join argument, and the lack of extra space in the map argument
  */
  userDescriptions(userDescriptionArray) {
    const withDashArray = userDescriptionArray.map(descriptor => `- ${descriptor}`);
    const descriptionString = withDashArray.join('\n\n');
    return descriptionString;
  }

  render() {
    const { usersState } = this.props;
    const { groupsState } = this.props;

    const { groups } = groupsState;
    const user = usersState.focusedUser;
    const primaryGroupName = get(user, 'primaryGroupName', null);

    return (
      <View style={{ flex: 1 }}>
        { user
        && (
          <View style={container}>
            <View style={styles.infoRow}>
              <Icon
                name='date-range'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <Text numberOfLines={1} style={styles.rightColumn}>{user.readableCreatedDate}</Text>
            </View>
            {user.location
            && (
              <View style={styles.infoRow}>
                <Icon
                  name='location-on'
                  containerStyle={{ marginRight: wp('5%') }}
                />
                <Text numberOfLines={1} style={styles.rightColumn}>{user.location}</Text>
              </View>
            )
            }
            <View style={styles.groupsSection}>
              <Icon
                name='group'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <View style={groupIconNameContainer}>
                <View style={this.getCircularColorStyle(getGroupColor(primaryGroupName, groups))} />
                <Text numberOfLines={1}> {primaryGroupName} </Text>
              </View>
            </View>
            <View style={styles.description}>
              <Text>{this.userDescriptions(user.description)}</Text>
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
  groupsSection: {
    flexDirection: 'row',
    marginTop: hp('3%'),
  },
  rightColumn: {
    paddingTop: hp('0.5%'),
  },
  infoRow: {
    width: wp('80%'),
    flexDirection: 'row',
    marginTop: hp('3%'),
  },
  description: {
    // flexDirection: 'row',
    // justifyContent: 'center',

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
    height: circularGroupIcon.height,
    width: circularGroupIcon.width,
    borderRadius: circularGroupIcon.borderRadius,
    marginRight: circularGroupIcon.marginRight,
    // we do NOT get margin left from circularGroupIcon
  },
});

const mapStateToProps = state => (
  {
    usersState: state.users,
    groupsState: state.groups,
  }
);

export default connect(mapStateToProps)(UserScreen);
