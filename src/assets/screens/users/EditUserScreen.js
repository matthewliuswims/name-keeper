import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { editUser, clearUsersErr, listAllUsers, deleteUser, focusUser } from '../../../redux/actions/users';
import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';
import { listGroups, focusGroup } from '../../../redux/actions/groups';

import ErrorModal from '../../components/modal/Error';
import DeleteModal from '../../components/modal/Delete';

import { container, groupIconNameContainerEditAddUser, topRightTextButtonContainerSolo, topRightButtonText, circularGroupIcon, deleteContainer } from '../../styles/base';
import { getGroupColor } from '../../../lib/groupColors';
import colors from '../../styles/colors';

import { parseToLongDate } from '../../../lib/dates';

type Props = {
  navigation: () => void,
  groupsState : {
    groups: Array<Object>,
    focusedGroupName: String,
  }
};

const { Form } = tComb.form;

const userForm = tComb.struct({
  name: tComb.String,
  location: tComb.maybe(tComb.String),
  description: tComb.String,
});

const options = {
  fields: {
    name: {
      placeholder: 'Person\'s name',
      error: 'Please enter a name',
    },
    description: {
      placeholder: 'Notable impression(s)',
      error: 'Description is required',
      multiline: true,
      stylesheet: {
        ...Form.stylesheet,
        textbox: {
          ...Form.stylesheet.textbox,
          normal: {
            ...Form.stylesheet.textbox.normal,
            height: 60,
          },
          error: {
            ...Form.stylesheet.textbox.error,
            height: 60,
          },
        },
      },
    },
    location: {
      placeholder: 'Optional',
    },
  },
};


const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class EditUserScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.getUserValue(),
      selectedGroupName: this.props.groupsState.focusedGroupName,
      groupDropdownOpen: false,
      deleteModalOpen: false,
    };
  }

  /**
   * @tutorial https://reactnavigation.org/docs/en/header-buttons.html#header-interaction-with-its-screen-component
   * for onPress we need a noOp, otherwise we'd get an error, because React Navigation does NOT guarantee
   * that the screen component will be mounted before the header.
   */
  static navigationOptions = ({ navigation }) => {
    const navUserName = navigation.getParam('focusedUserName');
    const userName = navUserName || '';
    const titleDisplay = navUserName ? `Edit ${userName}` : '';

    return {
      title: titleDisplay,
      headerRight: (
        // getParam('userSubmit') refers to the 'userSubmit' function in componentDidMount
        <TouchableOpacity onPress={navigation.getParam('userSubmit') || noOp} style={topRightTextButtonContainerSolo}>
          <Text style={topRightButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    };
  };

  getUserValue() {
    const { location, description, name } = this.props.usersState.focusedUser;
    return Object.assign({}, { location, description, name });
  }

  componentDidMount() {
    this.props.navigation.setParams({ userSubmit: this.userSubmit });
  }

  userSubmit = async () => {
    const { navigation } = this.props;
    const navigatedFromUsersScreen = navigation.getParam('editUserFromUsersScreen', '');

    const userStruct = this.formRef.getValue();
    if (!this.formRef) return;

    if (userStruct) {
      const { name, location, description } = userStruct;
      const { userID } = this.props.usersState.focusedUser;

      const descriptionAsArray = [description];
      const user = {
        userID,
        name,
        description: descriptionAsArray, // right now we only have 1 string element in the description array, but can potentially add on to this
        location,
        primaryGroupName: this.state.selectedGroupName,
      };

      await this.props.editUser(user);
      if (!this.props.usersState.error) {
        await this.props.listAllUsers();
      } // else, we wait for the errModal to popup here
      if (!this.props.usersState.error) {
        this.props.focusGroup(this.state.selectedGroupName);

        // it's really bad, but since the DB (upstream where it gets the creationDate) doesn't return the new user
        // we have to manually jam it here, just to show it one time.
        const oneTimeDateForUI = Date.now();
        const userForUI = Object.assign({}, user, {
          readableCreatedDate: parseToLongDate(oneTimeDateForUI),
        });

        this.props.focusUser(userForUI);
        this.navigateToScreen(navigatedFromUsersScreen);
      } // else, we wait for the errModal to popup here
    }
  }

  navigateToScreen = (navigatedFromUsersScreen) => {
    if (navigatedFromUsersScreen) {
      this.props.navigation.goBack();
      return;
    }
    const resetAction = StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: 'GroupsScreen' }),
        NavigationActions.navigate({ routeName: 'GroupScreen' }),
        NavigationActions.navigate({ routeName: 'UserScreen' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  getColorStyle(groupColor) {
    const circularGroupIconNoColor = circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
      opacity: 1,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }


  checkErrGrps = (err) => {
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

  getCircularColorStyle(groupColor) {
    const circularGroupIconNoColor = circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }

  /**
   * @param {Array<Object>} allGroups - unordered groups from groups redux
   */
  selectedGroupUI(allGroups) {
    return (
      <TouchableOpacity
        style={styles.initialGroupSelection}
        onPress={() => {
          this.setState((state) => {
            return { groupDropdownOpen: !state.groupDropdownOpen };
          });
        }
        }
      >
        <View style={groupIconNameContainerEditAddUser}>
          <View style={this.getCircularColorStyle(getGroupColor(this.state.selectedGroupName, allGroups))} />
          <Text numberOfLines={1}> {this.state.selectedGroupName} </Text>
        </View>
        <Icon
          name='keyboard-arrow-down'
        />
      </TouchableOpacity>
    );
  }


  /**
   * @param {Array<Object>} allGroups - unordered groups from groups redux
   * @return selection UI for 'other' groups in the dropdown
   */
  otherGroupsDropdown(allGroups) {
    const otherGroups = allGroups.filter(group => group.name !== this.state.selectedGroupName);
    if (otherGroups.length === 0 || !this.state.groupDropdownOpen) {
      return null; // if not open, don't show a dropdown
    }

    return (
      <FlatList
        data={otherGroups}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.otherGroupSelection}
            onPress={() => { this.otherGroupClick(item); }}
          >
            <View style={groupIconNameContainerEditAddUser}>
              <View style={this.getCircularColorStyle(getGroupColor(item.name, otherGroups))} />
              <Text numberOfLines={1}> {item.name} </Text>
            </View>
            <Icon
              name='keyboard-arrow-down'
              color='#F2F2F2'
            />
          </TouchableOpacity>)
        }
        keyExtractor={(item => `${item.groupID}`)}
      />
    );
  }


  onChange = (value) => {
    this.setState({ value });
  }

  otherGroupClick = (group) => {
    this.setState((state) => {
      return {
        groupDropdownOpen: !state.groupDropdownOpen,
        selectedGroupName: group.name,
      };
    });
  }

  openDeleteModal = () => {
    this.setState({
      deleteModalOpen: true,
    });
  }

  closeDeleteModal = () => {
    this.setState({
      deleteModalOpen: false,
    });
  }

  deleteUser = async () => {
    this.closeDeleteModal();
    await this.props.deleteUser(this.props.usersState.focusedUser);
    this.props.listAllUsers();

    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'GroupsScreen' }),
        NavigationActions.navigate({ routeName: 'GroupScreen' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  deleteModal = () => {
    if (this.state.deleteModalOpen) {
      return (
        <DeleteModal
          deleteModalOpen={this.state.deleteModalOpen}
          deleteFunc={this.deleteUser}
          closeDeleteModal={this.closeDeleteModal}
          currentFocusedScreen={this.props.navigation.isFocused()}
          deleteGroup={false}
        />
      );
    }
  }

  groupsSection = (allGroups) => {
    if (allGroups.length === 1) {
      return (
        <View style={styles.groupSection}>
          <View style={groupIconNameContainerEditAddUser}>
            <View style={this.getCircularColorStyle(getGroupColor(this.state.selectedGroupName, allGroups))} />
            <Text numberOfLines={1}> {this.state.selectedGroupName} </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.groupsSection}>
        {this.selectedGroupUI(allGroups)}
        {this.otherGroupsDropdown(allGroups)}
      </View>
    );
  }


  render() {
    const { groups: allGroups, loading } = this.props.groupsState;
    const { loading: usersStateLoading } = this.props.usersState;

    if (loading || usersStateLoading) {
      return (
        <LoadingSpinner />
      );
    }

    // @tutorial: https://stackoverflow.com/questions/29363671/can-i-make-dynamic-styles-in-react-native
    // diegoprates
    return (
      <KeyboardAvoidingView
        style={container}
        behavior="padding"
        enabled
        keyboardVerticalOffset={80}
      >
        <ScrollView>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({
                groupDropdownOpen: false,
              });
            }}
          >
            <React.Fragment>
              <Form
                ref={(c) => { this.formRef = c; }}
                type={userForm}
                value={this.state.value}
                onChange={this.onChange}
                options={options}
              />
              <Text style={styles.groupText}> Group </Text>
              {this.groupsSection(allGroups)}
              {this.checkErrGrps(this.props.groupsState.error)}
              {this.checkErrUsrs(this.props.usersState.error)}
              <View style={deleteContainer}>
                <TouchableOpacity onPress={this.openDeleteModal}>
                  <Icon
                    name='delete'
                    size={wp('10%')}
                    iconStyle={{
                      marginRight: wp('2%'),
                      padding: wp('5%'),
                    }}
                  />
                </TouchableOpacity>
              </View>
              {this.deleteModal()}
            </React.Fragment>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  deleteText: {
    color: 'red',
    fontSize: 21,
    textAlign: 'center',
  },
  groupText: {
    fontWeight: '500',
    fontSize: 17,
  },
  groups: {
    marginTop: hp('2%'),
  },
  initialGroupSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.75,
    borderColor: 'black',
  },
  groupSection: {
    marginTop: hp('2%'),
  },
  groupsSection: {
    marginTop: hp('1%'),
  },
  otherGroupSelection: {
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 0.75,
    borderRightWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: colors.borderColor,
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
    focusUser: user => dispatch(focusUser(user)),
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    editUser: user => dispatch(editUser(user)),
    deleteUser: user => dispatch(deleteUser(user)),
    listAllUsers: () => dispatch(listAllUsers()),
    listGroups: () => dispatch(listGroups()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditUserScreen);
