import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, CheckBox } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';

import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container, innardsStyleContainer, circularGroupIcon, groupIconNameContainer, checkBoxBase } from '../../styles/base';

// @TODO: have to make flex dynamic based upon number of groups and/or location presence?
// or just use HP for the height of each rowInfo <-- proabably better (instead of flex)?


// but to complicate things even more, the # of groups can be dynamic(ish)? if that's the case
// flex might be really a better option to choose
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
    const formattedDate = momentDate.format('h:mm A, dddd, MMMM Do ');
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

  /**
   * @TODO: fill this out
   */
  checkboxToRender() {
    return (
      <CheckBox
        checked
        checkedColor='grey'
        containerStyle={checkBoxBase}
      />
    );
  }


  render() {
    const { usersState } = this.props;
    const user = usersState.focusedUser;

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
            <View style={styles.innardsStyleContainer}>
              <Icon
                name='group'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <View style={styles.groupIconNameContainer}>
                <View style={this.getCircularColorStyle('red')} />
                <Text> Some group </Text>
              </View>
              {this.checkboxToRender()}
            </View>
            <View style={styles.infoRow}>
              <View style={styles.description}>
                <Text> I IS DESCRIPTION AND I TAKE SPACE </Text>
              </View>
            </View>
          </View>
        )
          }
      </View>
    );
  }
}

/**
 * NOTICE: infoRow is not given a flex:1, because we don't want it to expand down.
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
  innardsStyleContainer: {
    flexDirection: innardsStyleContainer.flexDirection,
    justifyContent: innardsStyleContainer.justifyContent,
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
    marginTop: hp('2%'),
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
  }
);

export default connect(mapStateToProps)(UserScreen);
