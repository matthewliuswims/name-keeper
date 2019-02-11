import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import ErrorModal from '../../components/modal/Error';

import { container, topRightTextButtonContainer, topRightButtonText } from '../../styles/base';

import { editGroup, listGroups, clearGroupsErr } from '../../../redux/actions/groups';
import { listAllUsers, clearUsersErr } from '../../../redux/actions/users';

type Props = {
  navigation: () => void,
};

const { Form } = tComb.form;

const group = tComb.struct({
  name: tComb.String,
});

const options = {
  fields: {
    name: {
      error: 'Please enter a group name',
      placeholder: 'Group Name',
    },
  },
};

const noOp = () => { console.log('please try again in a second'); }; // eslint-disable-line no-console

class AddGroupScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.geGroupValue(),
    };
  }

  geGroupValue = () => {
    return ({ name: this.props.groupsState.focusedGroupName });
  }

  /**
   * @tutorial https://reactnavigation.org/docs/en/header-buttons.html#header-interaction-with-its-screen-component
   * for onPress we need a noOp, otherwise we'd get an error, because React Navigation does NOT guarantee
   * that the screen component will be mounted before the header.
   */
  static navigationOptions = ({ navigation }) => {
    return {
      title: `Edit ${navigation.getParam('focusedGroupName')}`,
      headerRight: (
        // getParam('groupSubmit') refers to the 'groupSubmit' function in componentDidMount
        <TouchableOpacity onPress={navigation.getParam('groupSubmit') || noOp}>
          <View style={topRightTextButtonContainer}>
            <Text style={topRightButtonText}> Save</Text>
          </View>
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ groupSubmit: this.groupSubmit });
  }

  groupSubmit = async () => {
    /**
     * Calling getValue will cause the validation of all the fields of the form,
     *  including some side effects like highlighting the errors.
     * @tutorial https://github.com/gcanti/tcomb-form-native
     */
    const groupStruct = this.formRef.getValue();
    // remember below Form type is group
    if (groupStruct) {
      const { name: newGroupName } = groupStruct;
      await this.props.editGroup(this.props.groupsState.focusedGroupName, newGroupName);

      if (!this.props.groupsState.error) {
        await this.props.listGroups();
      } // else, we wait for the errModal to popup here

      if (!this.props.groupsState.error) {
        await this.props.listAllUsers();
      } // else, we wait for the errModal to popup here

      if (!this.props.groupsState.error && !this.props.usersState.error) {
        this.props.navigation.popToTop();
        this.props.focusGroup(newGroupName);
        this.props.navigation.navigate('GroupScreen',
          {
            newGroupName,
          });
      } // else, we wait for the errModal to popup herea
    }
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

  onChange = (value) => {
    this.setState({ value });
  }

  render() {
    return (
      <View style={container}>
        <View>
          <Form
            ref={(c) => { this.formRef = c; }}
            type={group}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />
        </View>
        {this.checkErrGrps(this.props.groupsState.error)}
        {this.checkErrUsrs(this.props.usersState.error)}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => (
  {
    clearGroupsErr: () => dispatch(clearGroupsErr()),
    clearUsersErr: () => dispatch(clearUsersErr()),
    listGroups: () => dispatch(listGroups()),
    listAllUsers: () => dispatch(listAllUsers()),
    editGroup: (currentGroupName, newGroupName) => dispatch(editGroup(currentGroupName, newGroupName)),
  }
);

const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupScreen);
