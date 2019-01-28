import React, { Component, Fragment } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';

import { listAllUsers, focusUser } from '../../../redux/actions/users';
import { container, horizontalGroupScreenButton } from '../../styles/base';
import colors from '../../styles/colors';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';

import RightHeaderComponent from '../../components/headers/RightGroupHeader';

import ErrorModal from '../../components/modal/Error';
import { getGroupColor } from '../../../lib/groupColors';

type Props = {
  groupsState : {
    focusedGroupName: String,
  },
  usersState: {
    users: Array<Object>,
    focusedGroupName: String,
  },
  listAllUsers: () => Promise<Object>,
};

class GroupScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.props.listAllUsers();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('groupName', 'GroupScreen'),
      headerRight: <RightHeaderComponent />,
    };
  };


  /**
   * will only get the users where user.primaryGroupName === groupName
   * @param {string} groupName
   */
  usersForGroup(groupName) {
    const { users } = this.props.usersState;
    if (!users) return [];
    const usersInGroup = this.props.usersState.users.filter((user) => {
      return user.primaryGroupName === groupName;
    });
    return usersInGroup;
  }

  noGroupContents() {
    return (
      <View style={styles.noGroupContainer}>
        <Text style={styles.noGroupHeader}>
          Add a user below!
        </Text>
        <Text style={styles.noGroupMessage}>
          Hint: if you want to delete/edit this group, click on the top right 3 vertical circles.
        </Text>
      </View>
    );
  }

  groupContents(groupName) {
    return (
      <FlatList
        data={this.usersForGroup(groupName)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress = {() => {
              this.props.focusUser(item);
              this.props.navigation.navigate('UserScreen',
                {
                  username: item.name,
                });
            }}
          >
            <UserBox
              username={item.name}
              userDescription={item.description}
              date={parseToShortDate(item.createdDate)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item => `${item.userID}`)}
      />
    );
  }

  navigateToAddUserScreen = () => {
    this.props.navigation.navigate('AddUserScreen');
  }

  groupScreenWrapper(groupName, NumUsersForGroup) {
    return (
      <Fragment>
        <View style={styles.buttons}>
          {this.renderSortButton('Sort', this.openSortModal)}
        </View>
        <View style={styles.groupContents}>
          {NumUsersForGroup ? this.groupContents(groupName) : this.noGroupContents()}
        </View>
        <View style={styles.footer}>
          <Footer navigateToAddUserScreen={this.navigateToAddUserScreen} />
        </View>
      </Fragment>
    );
  }

  checkErrUsrs = (err) => {
    // don't want err to render if we're not even on the screen
    if (err) {
      return (
        <ErrorModal
          error={err}
          clearError={this.props.clearUsersErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }

  renderSortButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.sortBtn}>
      <Text style={styles.buttonTextSortFilter}>{text}</Text>
    </TouchableOpacity>
  );


  render() {
    if (this.props.groupsState.loading || this.props.usersState.loading) {
      return null;
    }
    const { focusedGroupName, groups } = this.props.groupsState;
    const NumUsersForGroup = this.usersForGroup(focusedGroupName).length;

    let groupColor;
    try {
      groupColor = getGroupColor(focusedGroupName, groups);
    } catch (err) {
      return null; // because we delete the group, there's a time when we re-render this container but the group doesn't exist anymore
    }
    const borderColor = {
      borderColor: groupColor,
    };
    const combinedContainerStyle = StyleSheet.flatten([styles.container, borderColor]);

    return (
      <View style={combinedContainerStyle}>
        {this.groupScreenWrapper(focusedGroupName, NumUsersForGroup) }
        {this.checkErrUsrs(this.props.usersState.error)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noGroupHeader: {
    fontWeight: 'bold',
    fontSize: RF(4),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  buttons: {
    marginBottom: hp('1%'),
  },
  sortBtn: {
    backgroundColor: colors.filterSortColor, // @TODO: take from pallete

    // below is to have the button width manually triggered
    // width: wp('15%'),

    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),

    alignItems: horizontalGroupScreenButton.alignItems,
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    marginBottom: horizontalGroupScreenButton.marginBottom,
  },
  buttonTextSortFilter: {
    color: 'white',
  },
  noGroupMessage: {
    fontSize: RF(2.5),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  noGroupContainer: {
    paddingTop: hp('25%'),
  },
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    backgroundColor: container.backgroundColor,
    borderTopWidth: 3,
    paddingLeft: container.paddingLeft,
    paddingRight: container.paddingRight,
  },
  groupContents: {
    flex: 11,
  },
  footer: {
    flex: 1,
  },
});

const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
  }
);

const mapDispatchToProps = dispatch => (
  {
    listAllUsers: () => dispatch(listAllUsers()),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
