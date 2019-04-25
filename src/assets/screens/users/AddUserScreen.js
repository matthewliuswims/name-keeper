// @flow
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { addUser, clearUsersErr, listAllUsers } from '../../../redux/actions/users';
import { focusGroup } from '../../../redux/actions/groups';
import ErrorModal from '../../components/modal/Error';

import DescriptionTemplate from '../../components/form/Description';

import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';

import { container, groupIconNameContainerEditAddUser, topRightTextButtonContainerSolo, topRightButtonText, circularGroupIcon } from '../../styles/base';
import { getGroupColor } from '../../../lib/groupColors';
import colors from '../../styles/colors';

type Props = {
  navigation: () => void,
};

const { Form } = tComb.form;

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class AddUserScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      descriptionCounter: 0,
      value: null, // for form
      selectedGroupName: this.props.groupsState.focusedGroupName,
      groupDropdownOpen: false,
      formFields: { // used for this.userForm()
        name: tComb.String,
        location: tComb.maybe(tComb.String),
        description0: tComb.String,
      },
      options: {
        fields: {
          name: {
            placeholder: 'Person\'s name',
            error: 'Please enter a name',
          },
          description0: {
            template: DescriptionTemplate,
            placeholder: 'Notable impression(s)',
            error: 'Description is required',
            config: {
              number: 0,
              onlyDescriptor: true,
              isLast: true,
              addDescription: this.addDescription.bind(this),
            },
            multiline: true,
          },
          location: {
            placeholder: 'Optional',
          },
        },
      },
    };
  }

  userForm = () => {
    return (
      tComb.struct(this.state.formFields)
    );
  }

  addDescription() {
    this.setState((prevState) => {
      const descriptionCounter = prevState.descriptionCounter + 1;
      const prevCounter = prevState.descriptionCounter;
      const options = Object.assign({}, prevState.options);

      const descriptionField = {
        template: DescriptionTemplate,
        placeholder: 'Notable impression(s)',
        error: 'Description is required',
        config: {
          onlyDescriptor: false,
          isLast: true,
          number: descriptionCounter,
          addDescription: this.addDescription.bind(this),
        },
        multiline: true,
      };
      options.fields[`description${prevCounter}`].config.onlyDescriptor = false;
      options.fields[`description${prevCounter}`].config.isLast = false;

      options.fields[`description${descriptionCounter}`] = descriptionField;
      // tell first descriptor it's not the only descriptor
      options.fields.description0.config.onlyDescriptor = false;
      const formFields = Object.assign({}, prevState.formFields);
      formFields[`description${descriptionCounter}`] = tComb.String;
      console.log('options are', options);
      return {
        formFields,
        options,
        descriptionCounter,
      };
    });
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
    return {
      title: 'Add Person',
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
      const { name, location } = userStruct;
      const descriptorsLength = Object.keys(userStruct).length - 2;
      const descriptions = [];
      for (let i = 0; i < descriptorsLength; i++) {
        const description = userStruct[`description${i}`];
        descriptions.push(description);
      }

      const user = {
        name,
        description: descriptions,
        location,
        primaryGroupName: this.state.selectedGroupName,
      };

      await this.props.addUser(user);
      if (!this.props.usersState.error) {
        await this.props.listAllUsers();
      } // else, we wait for the errModal to popup here
      if (!this.props.usersState.error) {
        this.props.focusGroup(this.state.selectedGroupName);
        await this.resetFormValueState();
        this.navigateToScreen(this.state.selectedGroupName);
      } // else, we wait for the errModal to popup here
    }
  }

  navigateToScreen = (primaryGroupName) => {
    const { navigation } = this.props;
    const navigatedFromUsersScreen = navigation.getParam('addUserFromUsersScreen', '');
    if (navigatedFromUsersScreen) {
      navigation.goBack();
      return;
    }
    this.props.navigation.navigate('GroupScreen',
      {
        groupName: primaryGroupName,
      });
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
    console.log('on change called');
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
                style={styles.otherGroupSelection}
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
              style={styles.otherGroupSelection}
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

  groupsSection = (allGroups) => {
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
    console.log('this.state.options are', this.state.options);
    console.log('this.state.value are', this.state.value);
    if (loading || usersStateLoading) {
      return (
        <LoadingSpinner />
      );
    }

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
                type={this.userForm()}
                value={this.state.value}
                onChange={this.onChange}
                options={this.state.options}
              />
              <Text style={styles.groupText}> Group </Text>
              {this.groupsSection(allGroups)}
              {this.checkErrUsrs(this.props.usersState.error)}
            </React.Fragment>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  test: {
    borderColor: 'green',
    borderWidth: 4,
  },
  groupText: {
    fontWeight: '500',
    fontSize: 17,
  },
  groupSection: {
    marginTop: hp('1.5%'),
  },
  groupsSection: {
    marginTop: hp('1%'),
  },
  initialGroupSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.75,
    borderColor: 'black',
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
  groups: {
    marginTop: hp('2%'),
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
    addUser: user => dispatch(addUser(user)),
    focusGroup: grpName => dispatch(focusGroup(grpName)),
    listAllUsers: () => dispatch(listAllUsers()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen);
