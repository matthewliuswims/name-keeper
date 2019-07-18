import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
} from 'react-native';

import { Icon } from 'react-native-elements';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  editUser,
  clearUsersErr,
  listAllUsers,
  deleteUser,
  focusUser,
} from '../../../redux/actions/users';
import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';

import {
  addToast,
} from '../../../redux/actions/toasts';

import {
  focusGroup,
} from '../../../redux/actions/groups';

import DescriptionTemplate from '../../components/form/Description';
import ErrorModal from '../../components/modal/Error';
import DeleteModal from '../../components/modal/Delete';

import {
  containerNoList,
  groupIconNameContainerEditAddUser,
  topRightTextButtonContainerSolo,
  topRightButtonText,
  circularGroupIcon,
  deleteContainer,
  deleteText,
  initialGroupSelection,
  otherGroupSelection,
} from '../../styles/base';

import { getGroupColor } from '../../../lib/groupColors';

import { SLOT_FADE_OUT_DURATION } from '../../components/animations/DURATIONS';


const { Form } = tComb.form;

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class EditUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // should never be less than 1 length
      descriptionIDs: this.initialDescriptionNames(),
      value: this.initialUserValue(),
      selectedGroupName: this.props.groupsState.focusedGroupName,
      groupDropdownOpen: false,
      formFields: this.initialFormFields(), // user for this.userForm()
      options: this.initialOptionsFields(),
    };
  }

  initialFormFields = () => {
    const formFields = {
      name: tComb.String,
      location: tComb.maybe(tComb.String),
    };
    this.initialDescriptionNames().forEach((name, index) => {
      if (index === 0) {
        formFields[name] = tComb.String;
      } else {
        formFields[name] = tComb.maybe(tComb.String);
      }
    });
    return formFields;
  }

  /**
   * example return is
   * ['description0', 'description1']
   */
  initialDescriptionNames = () => {
    const { description } = this.props.usersState.focusedUser;
    return description.map((_, i) => `description${i}`);
  }

  initialOptionsFields = () => {
    const optionsFields = {
      fields: {
        name: {
          placeholder: 'Person\'s name',
          error: 'Please enter a name',
        },
        location: {
          placeholder: 'Place met',
        },
      },
    };
    const descriptionNames = this.initialDescriptionNames();

    descriptionNames.forEach((descriptorName) => {
      optionsFields.fields[descriptorName] = {
        template: DescriptionTemplate,
        placeholder: 'Notable impression(s)',
        error: 'Description is required',
        config: {
          id: descriptorName,
          isFirst: false, // will update at the end of this function
          isLast: false, // will update at the end of this function
          addDescription: this.addDescription.bind(this),
          removeDescription: this.removeDescription.bind(this),
        },
        multiline: true,
      };
    });
    // updating isFirst and is Last;
    optionsFields.fields[descriptionNames[0]].config.isFirst = true;
    optionsFields.fields[descriptionNames[descriptionNames.length - 1]].config.isLast = true;

    return optionsFields;
  }

  userForm = () => {
    return (
      tComb.struct(this.state.formFields)
    );
  }

  removeDescription(descriptionID) {
    // if i have a value in a field, and that field gets deleted
    // that value persists. Luckily in userSubmit, we
    // iterate over descriptionIDs for the userStruct, so we'll
    // ignore the unreaped descriptionIds.
    this.setState((prevState) => {
      // update options
      const options = Object.assign({}, prevState.options);
      delete options.fields[descriptionID];

      // update descriptionIDs
      const prevDescriptionIDs = prevState.descriptionIDs;
      const descriptionIDs = prevDescriptionIDs.filter(id => id !== descriptionID);
      // we make sure firstDescriptionID is the firstOne (in case the 1 we deleted was the firstOne)
      const [firstID] = descriptionIDs;
      options.fields[firstID].config.isFirst = true;
      if (descriptionIDs.length === 1) options.fields[firstID].isLast = true;

      // update formFields
      const formFields = Object.assign({}, prevState.formFields);
      // make the first formFormDescriptionId required
      formFields[firstID] = tComb.String;
      delete formFields[descriptionID];

      return {
        formFields,
        options,
        descriptionIDs,
      };
    });
  }

  addDescription() {
    this.setState((prevState) => {
      // uid would not be good for concurrent users, but we don't deal with that
      const uid = new Date().valueOf().toString();
      const descriptionID = `description${uid}`;
      const options = Object.assign({}, prevState.options);

      const prevDescriptionIDs = prevState.descriptionIDs;
      const prevLastKey = prevDescriptionIDs[prevDescriptionIDs.length - 1];
      const descriptionField = {
        template: DescriptionTemplate,
        placeholder: 'Notable impression(s)',
        error: 'Description is required',
        config: {
          isFirst: false,
          isLast: true,
          id: descriptionID,
          addDescription: this.addDescription.bind(this),
          removeDescription: this.removeDescription.bind(this),
        },
        multiline: true,
      };
      // tell prev descriptor it's not last
      options.fields[prevLastKey].config.isLast = false;

      options.fields[descriptionID] = descriptionField;
      const formFields = Object.assign({}, prevState.formFields);
      formFields[descriptionID] = tComb.maybe(tComb.String); // notice here it's a maybe

      const descriptionIDs = prevDescriptionIDs.concat(descriptionID);
      return {
        formFields,
        options,
        descriptionIDs,
      };
    });
  }

  initialUserValue() {
    // initialDescriptionNames.
    const { location, description, name } = this.props.usersState.focusedUser;
    const initiaUserValue = Object.assign({}, { location, name });
    const descriptorNames = this.initialDescriptionNames();
    // can assume description.length === this.initialDescriptionNames();
    description.forEach((val, index) => {
      const desName = descriptorNames[index];
      initiaUserValue[desName] = val;
    });

    return initiaUserValue;
  }

  componentDidUpdate(prevProps) {
    // this is when we add a group from addgroupscreen
    // we need to update selectedGroupName
    if (this.props.groupsState.focusedGroupName !== prevProps.groupsState.focusedGroupName) {
      this.setState({
        selectedGroupName: this.props.groupsState.focusedGroupName,
      });
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

  componentDidMount() {
    this.props.navigation.setParams({ userSubmit: this.userSubmit });
  }

  resetFormValueState = async () => {
    this.setState({
      value: null,
    });
  }

  userSubmit = async () => {
    const userStruct = this.formRef.getValue();
    if (!this.formRef) return;

    if (userStruct) {
      const { name: unparsedName, location } = userStruct;
      const name = unparsedName.trim();
      const { userID } = this.props.usersState.focusedUser;
      const descriptions = [];
      const { descriptionIDs } = this.state;
      for (const descriptionID of descriptionIDs) {
        const description = userStruct[descriptionID];
        // cause it's possible for a description to a blank field, we make a check to not include those
        if (description) descriptions.push(description.trim());
      }

      const user = {
        userID,
        name,
        description: descriptions,
        location,
        primaryGroupName: this.state.selectedGroupName,
      };

      await this.props.editUser(user);
      await this.props.focusUser(user);
      this.props.focusGroup(this.state.selectedGroupName);
      if (!this.props.usersState.error) {
        await this.props.listAllUsers();
      } // else, we wait for the errModal to popup here
      if (!this.props.usersState.error) {
        await this.resetFormValueState();
        const goingToGroupScreen = this.props.navigation.getParam('groupScreenToUserScreen', '');

        if (goingToGroupScreen) {
          this.props.addToast('Edited User', 'GroupScreen');
        } else {
          this.props.addToast('Edited User', 'GroupsScreen');
        }
        this.props.navigation.pop(2);
      } // else, we wait for the errModal to popup here
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

  addGroup = () => {
    this.setState((state) => {
      return {
        groupDropdownOpen: !state.groupDropdownOpen,
      };
    });
    this.props.navigation.navigate('AddGroupScreen', {
      fromAddUserScreen: 'true',
    });
  }


  /**
   * @param {Array<Object>} allGroups - unordered groups from groups redux
   * @return selection UI for 'other' groups in the dropdown
   */
  otherGroupsDropdown(allGroups) {
    const otherGroups = allGroups.filter(group => group.name !== this.state.selectedGroupName);
    if (!this.state.groupDropdownOpen) {
      return null; // if not open, don't show a dropdown
    }

    const addNewGroupOption = {
      groupID: 'addNewGroupOption',
      name: 'Add Group',
    };

    const otherGroupsWithOption = otherGroups.concat(addNewGroupOption);

    return (
      <FlatList
        data={otherGroupsWithOption}
        renderItem={({ item }) => {
          if (item.groupID === 'addNewGroupOption') {
            return (
              <TouchableOpacity
                style={otherGroupSelection}
                onPress={() => { this.addGroup(item); }}
              >
                <View style={groupIconNameContainerEditAddUser}>
                  <Icon
                    name='add'
                    size={circularGroupIcon.width}
                    iconStyle={{
                      height: circularGroupIcon.height,
                      width: circularGroupIcon.width,
                      marginRight: circularGroupIcon.marginRight,
                      marginLeft: circularGroupIcon.marginLeft,
                    }
                    }
                  />
                  <Text numberOfLines={1}> {item.name} </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              style={otherGroupSelection}
              onPress={() => { this.otherGroupClick(item); }}
            >
              <View style={groupIconNameContainerEditAddUser}>
                <View style={this.getCircularColorStyle(getGroupColor(item.name, otherGroups))} />
                <Text numberOfLines={1}> {item.name} </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item => `${item.groupID}`)}
      />
    );
  }

  /**
   * @param {Array<Object>} allGroups - unordered groups from groups redux
   */
  selectedGroupUI(allGroups) {
    const { groupDropdownOpen } = this.state;
    return (
      <TouchableOpacity
        style={initialGroupSelection}
        onPress={() => {
          this.setState((state) => {
            return { groupDropdownOpen: !state.groupDropdownOpen };
          });
        }
        }
      >
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={groupIconNameContainerEditAddUser}>
            <View style={this.getCircularColorStyle(getGroupColor(this.state.selectedGroupName, allGroups))} />
            <Text numberOfLines={1}> {this.state.selectedGroupName} </Text>
          </View>
          <Icon
            name={groupDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  groupsSection = (allGroups) => {
    return (
      <View style={styles.groupsSection}>
        {this.selectedGroupUI(allGroups)}
        {this.otherGroupsDropdown(allGroups)}
      </View>
    );
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
    Animated.timing(this.props.usersState.focusedUser.animatedSlotOpacity, {
      toValue: 0,
      duration: SLOT_FADE_OUT_DURATION,
    }).start(async () => {
      this.props.addToast('Deleted User', 'GroupScreen');
      await this.props.deleteUser(this.props.usersState.focusedUser);
      this.props.listAllUsers();
    });
    // below code called before animation finishes.
    const navigatedFromUsersScreen = this.props.navigation.getParam('addUserFromUsersScreen', '');
    if (navigatedFromUsersScreen) {
      // from users screen you can user the drawer edit.
      this.props.navigation.goBack();
    } else {
      // will pop back to user screen, (group screen/groups screen)
      this.props.navigation.pop(2);
    }
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

  render() {
    const { groups: allGroups, loading } = this.props.groupsState;
    const { loading: usersStateLoading } = this.props.usersState;

    if (loading || usersStateLoading) {
      return (
        <LoadingSpinner />
      );
    }

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={containerNoList}
        behavior="padding"
      >
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps='handled'
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              this.setState({
                groupDropdownOpen: false,
              });
            }}
          >
            <React.Fragment>
              <Form
                ref={(c) => { this.formRef = c; }}
                type={this.userForm()}
                value={this.state.value}
                onChange={this.onChange}
                options={this.state.options}
              />
              <Text style={styles.groupText}> Group </Text>
              {this.groupsSection(allGroups)}
              {this.checkErrUsrs(this.props.usersState.error)}
              <TouchableOpacity onPress={this.openDeleteModal} style={deleteContainer}>
                <Text style={deleteText}> Delete </Text>
              </TouchableOpacity>
              {this.deleteModal()}
            </React.Fragment>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  groupText: {
    fontWeight: '500',
    fontSize: 17,
  },
  groupsSection: {
    marginTop: hp('1%'),
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
    addToast: (message, screenName) => dispatch(addToast(message, screenName)),
    focusUser: user => dispatch(focusUser(user)),
    deleteUser: user => dispatch(deleteUser(user)),
    editUser: user => dispatch(editUser(user)),
    focusGroup: grpName => dispatch(focusGroup(grpName)),
    listAllUsers: () => dispatch(listAllUsers()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditUserScreen);
