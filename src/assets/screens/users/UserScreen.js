import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';

import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';

// @TODO: have to make flex dynamic based upon number of groups and/or location presence?
// or just use HP for the height of each rowInfo <-- proabably better (instead of flex)?

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

  render() {
    const { usersState } = this.props;
    const user = usersState.focusedUser;

    return (
      <View style={styles.containerWrapper}>
        { user
        && (
          <View style={styles.container}>
            <View style={styles.infoRow}>
              <Icon
                name='date-range'
                containerStyle={{ marginRight: wp('5%') }}
              />
              <Text style={styles.dateText}>{this.parseDate(user.lastEdit)}</Text>
            </View>
            {user.location
            && (
              <View style={styles.infoRow}>
                <Icon
                  name='location-on'
                  containerStyle={{ marginRight: wp('5%') }}
                />
                <Text style={styles.dateText}>{user.location}</Text>
              </View>
            )
            }
            <View style={styles.description}>
              <Text style={styles.description}> I IS DESCRIPTION AND I TAKE SPACE </Text>
            </View>
          </View>
        )
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
  },
  dateText: {
    paddingTop: hp('0.5%'),
  },
  infoRow: {
    flex: container.flex,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  description: {
    flex: 5,
  },
});

const mapStateToProps = state => (
  {
    usersState: state.users,
  }
);

export default connect(mapStateToProps)(UserScreen);
