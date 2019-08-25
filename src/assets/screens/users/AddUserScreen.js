import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
  addUser,
  clearUsersErr,
  listAllUsers,
} from '../../../redux/actions/users';
import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';
import {
  focusGroup,
} from '../../../redux/actions/groups';

import {
  addToast,
} from '../../../redux/actions/toasts';

import DescriptionTemplate from '../../components/form/Description';
import ErrorModal from '../../components/modal/Error';

import {
  containerNoList,
  groupIconNameContainerEditAddUser,
  topRightTextButtonContainerSolo,
  topRightButtonText,
  circularGroupIcon,
  initialGroupSelection,
  otherGroupSelection,
} from '../../styles/base';

import { getGroupColor } from '../../../lib/groupColors';

const { Form } = tComb.form;

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class AddUserScreen extends Component {
  constructor(props) {
    super(props);
    this.optionsFields = this.optionsFields.bind(this);
    this.state = {
      // should never be less than 1 length
      descriptionIDs: ['description0'],
      value: null, // for form
      selectedGroupName: this.props.groupsState.focusedGroupName,
      groupDropdownOpen: false,
      formFields: { // used for this.userForm()
        name: tComb.String,
        location: tComb.maybe(tComb.String),
        description0: tComb.String,
      },
      options: this.optionsFields(),
    };
    this.scrollViewContentOffset = 0;
    this.arraysRefWrapper = [];
  }

  setRef = (ref, refId) => {
    const {
      arraysRefWrapper,
    } = this;

    // already contains the refID
    if (arraysRefWrapper.some(({ id }) => id === refId)) return;

    this.arraysRefWrapper.push({
      ref,
      id: refId,
    });
  }

  /**
   * only used for initialization (and NOT for add description).
   * code duplicated in addDescription method
   */
  optionsFields() {
    return (
      {
        fields: {
          name: {
            placeholder: 'Person\'s name',
            error: 'Please enter a name',
            autoCorrect: false,
          },
          description0: {
            template: DescriptionTemplate,
            placeholder: 'Notable impression(s)',
            error: 'Description is required',
            config: {
              id: 'description0',
              isFirst: true,
              isLast: true,
              addDescription: this.addDescription.bind(this),
              removeDescription: this.removeDescription.bind(this),
              setRef: this.setRef.bind(this),
            },
            multiline: true,
          },
          location: {
            placeholder: 'Place met',
          },
        },
      }
    );
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
      delete formFields[descriptionID];
      // make the first formFormDescriptionId required
      formFields[firstID] = tComb.String;

      return {
        formFields,
        options,
        descriptionIDs,
      };
    }, () => {
      const updatedArraysRefWrapper = this.arraysRefWrapper.filter(({ id }) => id !== descriptionID);
      this.arraysRefWrapper = updatedArraysRefWrapper;
    });
  }

  addDescription(e) {
    this.scrollViewRef.props.scrollToPosition(0, this.scrollViewContentOffset + 70);
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
          setRef: this.setRef.bind(this),
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
        options, // Form relies on this --> options={this.state.options}
        descriptionIDs,
      };
    }, () => {
      const {
        arraysRefWrapper,
      } = this;

      const latestTextinputRefWrapper = arraysRefWrapper[arraysRefWrapper.length - 1];
      const {
        ref,
      } = latestTextinputRefWrapper;
      ref.focus();
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
    // even if there's an error, then it's fine (and actually good), because
    // the error will only ever be with the name (aka at the top), so the user will see it
    this.scrollViewRef.props.scrollToPosition(0, 0);
    const userStruct = this.formRef.getValue();
    if (!this.formRef) return;

    if (userStruct) {
      const { name: unparsedName, location } = userStruct;
      const name = unparsedName.trim();
      const descriptions = [];
      const { descriptionIDs } = this.state;
      for (const descriptionID of descriptionIDs) {
        const description = userStruct[descriptionID];
        // cause it's possible for a description to a blank field, we make a check to not include those
        if (description) descriptions.push(description.trim());
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
        this.props.focusGroup(this.state.selectedGroupName);
        await this.resetFormValueState();

        const { navigation } = this.props;
        const navigatedFromUsersScreen = navigation.getParam('addUserFromUsersScreen', '');

        this.props.addToast('Added Person', navigatedFromUsersScreen ? 'GroupsScreen' : 'GroupScreen');
        this.props.navigation.pop(1);
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
    const { groupDropdownOpen, selectedGroupName } = this.state;

    const otherGroups = allGroups.filter(group => group.name !== selectedGroupName);
    if (!groupDropdownOpen) {
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

  handleScroll = (event) => {
    // get the content offset
    this.scrollViewContentOffset = event.nativeEvent.contentOffset.y;
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
        onScroll={this.handleScroll}
        contentContainerStyle={containerNoList}
        behavior="padding"
        keyboardShouldPersistTaps='handled'
        innerRef={ref => {
          this.scrollViewRef = ref
        }}
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
            <View style={{ flex: 1 }}>
              <Form
                ref={(c) => { this.formRef = c; }}
                type={this.userForm()}
                value={this.state.value}
                onChange={this.onChange}
                options={this.state.options}
                keyboardShouldPersistTaps='handled'
              />
              <Text style={styles.groupText}> Group </Text>
              {this.groupsSection(allGroups)}
              {this.checkErrUsrs(this.props.usersState.error)}
            </View>
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
    addUser: user => dispatch(addUser(user)),
    focusGroup: grpName => dispatch(focusGroup(grpName)),
    listAllUsers: () => dispatch(listAllUsers()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen);
