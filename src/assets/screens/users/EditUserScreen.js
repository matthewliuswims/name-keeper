import React, { Component, Fragment } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { editUser, clearUsersErr, listAllUsers, deleteUser } from '../../../redux/actions/users';
import { listGroups } from '../../../redux/actions/groups';

import ErrorModal from '../../components/modal/Error';
import DeleteModal from '../../components/modal/Delete';

import { container, groupIconNameContainer, topRightSaveButton, topRightSaveButtonText, circularGroupIcon } from '../../styles/base';
import { getGroupColor } from '../../../lib/groupColors';
import colors from '../../styles/colors';

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
      placeholder: 'What stands out?',
      error: 'Description is required',
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
    return {
      title: `Edit ${navigation.getParam('focusedUserName')}`,
      headerRight: (
        // getParam('userSubmit') refers to the 'userSubmit' function in componentDidMount
        <TouchableOpacity onPress={navigation.getParam('userSubmit') || noOp}>
          <View style={styles.saveButton}>
            <Text style={styles.saveButtonText}> Save</Text>
          </View>
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
    const userStruct = this.formRef.getValue();

    if (userStruct) {
      const { name, location, description } = userStruct;
      const { userID } = this.props.usersState.focusedUser;
      console.log('this.state.selectedGroupName', this.state.selectedGroupName);
      const user = {
        userID,
        name,
        description,
        location,
        primaryGroupName: this.state.selectedGroupName,
      };

      await this.props.editUser(user);
      if (!this.props.usersState.error) {
        await this.props.listAllUsers();
      } // else, we wait for the errModal to popup here
      if (!this.props.usersState.error) {
        this.props.navigation.navigate('GroupScreen');
      } // else, we wait for the errModal to popup here
    }
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
    const circularGroupIconNoColor = styles.circularGroupIcon;
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
        <View style={styles.groupIconNameContainer}>
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
            <View style={styles.groupIconNameContainer}>
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
    // so the back button is correct, else back button but would be deleted user screen
    this.props.navigation.popToTop();
    this.props.navigation.navigate('GroupScreen',
      {
        groupName: this.props.groupsState.focusedGroupName,
      });
  }

  deleteModal = () => {
    if (this.state.deleteModalOpen) {
      return (
        <DeleteModal
          deleteModalOpen={this.state.deleteModalOpen}
          deleteFunc={this.deleteUser}
          closeDeleteModal={this.closeDeleteModal}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }


  render() {
    const { groups: allGroups } = this.props.groupsState;
    // @tutorial: https://stackoverflow.com/questions/29363671/can-i-make-dynamic-styles-in-react-native
    // diegoprates
    return (
      <Fragment>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({
              groupDropdownOpen: false,
            });
          }}
        >
          <View style={container}>
            <Form
              ref={(c) => { this.formRef = c; }}
              type={userForm}
              value={this.state.value}
              onChange={this.onChange}
              options={options}
            />
            <Text style={styles.groupText}> Group </Text>
            <View style={styles.groupsSection}>
              {this.selectedGroupUI(allGroups)}
              {this.otherGroupsDropdown(allGroups)}
            </View>
            {this.checkErrGrps(this.props.groupsState.error)}
            {this.checkErrUsrs(this.props.usersState.error)}
            <TouchableOpacity style={styles.deleteContainer} onPress={this.openDeleteModal}>
              <Text style={styles.deleteText}> Delete Person </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        {this.deleteModal()}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  deleteContainer: {
    marginTop: hp('3%'),
    borderWidth: 1,
    padding: hp('1%'),
  },
  deleteText: {
    color: 'red',
    fontSize: 21,
    textAlign: 'center',
  },
  circularGroupIcon: {
    height: wp('4%'),
    width: wp('4%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
    marginLeft: wp('2%'),
  },
  groupText: {
    fontWeight: '500',
    fontSize: 17,
  },
  groupIconNameContainer: {
    flex: groupIconNameContainer.flex,
    flexDirection: groupIconNameContainer.flexDirection,
    paddingTop: hp('0.5%'),
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
  saveButton: {
    padding: topRightSaveButton.padding,
    marginRight: topRightSaveButton.marginRight,
    backgroundColor: topRightSaveButton.backgroundColor,
  },
  saveButtonText: {
    color: topRightSaveButtonText.color,
    fontWeight: topRightSaveButtonText.fontWeight,
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
    editUser: user => dispatch(editUser(user)),
    deleteUser: user => dispatch(deleteUser(user)),
    listAllUsers: () => dispatch(listAllUsers()),
    listGroups: () => dispatch(listGroups()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditUserScreen);
