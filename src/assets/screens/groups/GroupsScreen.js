import Sentry from 'sentry-expo';

import React, { Component, Fragment } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import RF from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { container, horizontalGroupScreenButton } from '../../styles/base';
import colors from '../../styles/colors';

import ErrorModal from '../../components/modal/Error';
import AddModal from '../../components/modal/Add';

import { listAllUsers, focusUser } from '../../../redux/actions/users';

import { listGroups, clearGroupsErr, focusGroup } from '../../../redux/actions/groups';
import Group from '../../components/groups/GroupBox';
import RightHeaderComponent from '../../components/headers/RightGroupsHeader';
import LeftHeaderComponent from '../../components/headers/LeftGroupsHeader';

import { parseToShortDate } from '../../../lib/dates';
import UserBox from '../../components/users/UserBox';


type Props = {
  navigation: () => void,
  listGroups: () => Promise<Object>,
  groupsState : {
    error: Object,
    groups: Array<Object>,
  }
};

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class GroupsScreen extends Component<Props> {
  constructor(props) {
    console.log('groups screen created - only on opening of app??');

    // Sentry.captureException(new Error('Oops! from groupsscreen'));
    // Sentry.captureMessage('Something happened testeronbi', {
    //   level: 'info', // one of 'info', 'warning', or 'error'
    // });
    super(props);
    this.props.listGroups();
    this.props.listAllUsers();
    this.state = {
      addModalOpen: false,
      showingGroups: true,
      screenTitle: 'Groups',
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: params.screenTitle,
      headerRight: <RightHeaderComponent />,
      // getParam('swap') refers to the 'swap' function in componentDidMount
      headerLeft: <LeftHeaderComponent swap={navigation.getParam('swap') || noOp} showingGroups={params.showingGroups} />,
    };
  };

  componentDidMount() {
    const { showingGroups, screenTitle } = this.state;
    this.props.navigation.setParams({ screenTitle });
    this.props.navigation.setParams({ showingGroups });
    this.props.navigation.setParams({ swap: this.swap });
  }

  updateGroupsList = () => {
    this.props.listGroups();
  }

  checkErr = (err) => {
    // don't want err to render if we're not even on the screen
    if (err) {
      return (
        <ErrorModal
          error={err}
          clearError={this.props.clearGroupsErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }

  getTwoUsernames(groupName, users) {
    const parsedUsers = users.filter(user => user.primaryGroupName === groupName);
    return parsedUsers.map(user => user.name);
  }

  noGroupsText() {
    return (
      <View style={styles.noGroupContainer}>
        <Text style={styles.noGroupHeader}>
          Add a person you met below!
        </Text>
        <Text style={styles.noGroupMessage}>
          Before you add a person, you have to put them in a group.
        </Text>
      </View>
    );
  }

  groups = (users) => {
    return (
      !this.props.groupsState.loading && (
        <FlatList
          data={this.props.groupsState.groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress = {() => {
                this.props.focusGroup(item.name);
                this.props.navigation.navigate('GroupScreen',
                  {
                    groupName: item.name,
                  });
              }}
            >
              <Group
                groupName={item.name}
                firstTwoUsernames={this.getTwoUsernames(item.name, users)}
                />
            </TouchableOpacity>
          )}
          keyExtractor={(item => `${item.groupID}`)}
          extraData={this.props.usersState} // necessary to show the 2 users
        />)
    );
  }

  closeAddModal = () => {
    this.setState({
      addModalOpen: false,
    });
  }

  addUser = () => {
    //@TODO: implement
    this.setState({
      addModalOpen: false,
    });
  }

  addGroup = () => {
    this.setState({
      addModalOpen: false,
    });
    this.props.navigation.navigate('AddGroupScreen');
  }

  AddModalOpen() {
    if (this.state.addModalOpen) {
      return (
        <AddModal
          closeAddModal={this.closeAddModal}
          addUser={this.addUser}
          addGroup={this.addGroup}
        />
      );
    }
  }

  addClick = () => {
    this.setState({
      addModalOpen: true,
    });
  }

  swap = () => {
    this.setState((state) => {
      const showingGroups = !state.showingGroups;

      if (showingGroups) {
        this.props.navigation.setParams({
          screenTitle: 'Groups',
        });
      } else {
        this.props.navigation.setParams({
          screenTitle: 'People',
        });
      }

      this.props.navigation.setParams({
        showingGroups,
      });
      return { showingGroups };
    });
  }

  groupsList = (numberGroups, users) => {
    return numberGroups ? this.groups(users) : this.noGroupsText();
  }

  renderSortFilterButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress} style={text === 'Sort' ? styles.sortBtn : styles.filterBtn}>
      <Text style={styles.buttonTextSortFilter}>{text}</Text>
    </TouchableOpacity>
  );


  usersList = (users) => {
    return (
      <Fragment>
        <View style={styles.buttons}>
          {this.renderSortFilterButton('Sort', () => {})}
          {this.renderSortFilterButton('Filter', () => {})}
        </View>
        <FlatList
          data={users}
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
      </Fragment>
    );
  }

  render() {
    const { error: groupsStateErr, groups } = this.props.groupsState;
    const { users } = this.props.usersState;
    const numberGroups = groups.length;
    return (
      <View style={container}>
        { this.state.showingGroups ? this.groupsList(numberGroups, users) : this.usersList(users) }
        <TouchableOpacity
          style={styles.button}
          onPress = {this.addClick}
        >
          <Text style={{ color: 'white' }}> Add </Text>
        </TouchableOpacity>
        {this.AddModalOpen()}
        {this.checkErr(groupsStateErr)}
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
  noGroupMessage: {
    fontSize: RF(2.5),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  noGroupContainer: {
    paddingTop: hp('25%'),
    paddingBottom: hp('37%'),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  filterBtn: {
    flexGrow: 1,
    backgroundColor: '#6666ff', // @TODO: take from pallete

    paddingLeft: wp('7%'),
    paddingRight: wp('7%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    padding: horizontalGroupScreenButton.padding,

    alignItems: horizontalGroupScreenButton.alignItems,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
    borderLeftWidth: 1,
    borderLeftColor: 'black',
    marginBottom: horizontalGroupScreenButton.marginBottom,
  },
  sortBtn: {
    flexGrow: 1,
    backgroundColor: '#6666ff', // @TODO: take from pallete

    paddingLeft: wp('7%'),
    paddingRight: wp('7%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    padding: horizontalGroupScreenButton.padding,

    alignItems: horizontalGroupScreenButton.alignItems,
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    marginBottom: horizontalGroupScreenButton.marginBottom,
  },
  buttonTextSortFilter: {
    color: 'white',
  },
  button: {
    backgroundColor: colors.addApplyColor,

    alignItems: horizontalGroupScreenButton.alignItems,
    padding: horizontalGroupScreenButton.padding,
    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
    shadowColor: horizontalGroupScreenButton.shadowColor,
    shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    shadowRadius: horizontalGroupScreenButton.shadowRadius,
    shadowOffset: horizontalGroupScreenButton.shadowOffset,
    paddingTop: horizontalGroupScreenButton.paddingTop,
    paddingBottom: horizontalGroupScreenButton.paddingBottom,
    marginBottom: horizontalGroupScreenButton.marginBottom,
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
    listGroups: () => dispatch(listGroups()),
    clearGroupsErr: () => dispatch(clearGroupsErr()),
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    listAllUsers: () => dispatch(listAllUsers()),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
