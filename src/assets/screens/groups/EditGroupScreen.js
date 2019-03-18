import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';

import ErrorModal from '../../components/modal/Error';
import DeleteModal from '../../components/modal/Delete';

import { container, topRightTextButtonContainerSolo, topRightButtonText, deleteContainer, addEditInstructionsGroupText, deleteText } from '../../styles/base';

import { editGroup, listGroups, clearGroupsErr, deleteGroup, focusGroup } from '../../../redux/actions/groups';
import { listAllUsers, clearUsersErr } from '../../../redux/actions/users';

import { DUPLICATE_GROUP_NAME } from '../../../lib/errors/overrides';

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
    this.props.navigation.setParams({ getGroupName: this.props.groupsState.focusedGroupName });
    this.state = {
      value: this.getGroupValue(),
      deleteModalOpen: false,
    };
  }


  groupText() {
    return (
      <Text style={addEditInstructionsGroupText}>
        You can rename/delete the group here. BUT, if you want to modify the people within a group, you need to click on a person.
      </Text>
    );
  }


  getGroupValue = () => {
    return ({ name: this.props.groupsState.focusedGroupName });
  }

  /**
   * @tutorial https://reactnavigation.org/docs/en/header-buttons.html#header-interaction-with-its-screen-component
   * for onPress we need a noOp, otherwise we'd get an error, because React Navigation does NOT guarantee
   * that the screen component will be mounted before the header.
   */
  static navigationOptions = ({ navigation }) => {
    const navGroupName = navigation.getParam('getGroupName');
    const groupName = navGroupName || '';
    const titleDisplay = navGroupName ? `Edit ${groupName}` : '';
    return {
      title: titleDisplay,
      headerRight: (
        // getParam('groupSubmit') refers to the 'groupSubmit' function in componentDidMount
        <TouchableOpacity onPress={navigation.getParam('groupSubmit') || noOp} style={topRightTextButtonContainerSolo}>
          <Text style={topRightButtonText}>Save</Text>
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
    if (!this.formRef) return;

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
        this.props.focusGroup(newGroupName);
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'GroupsScreen' }),
            NavigationActions.navigate({ routeName: 'GroupScreen' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
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
          overrides={DUPLICATE_GROUP_NAME}
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
          overrides={DUPLICATE_GROUP_NAME}
          clearError={this.props.clearUsersErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
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

  deleteGroup = async () => {
    await this.props.deleteGroup(this.props.groupsState.focusedGroupName);
    await this.props.navigation.navigate('GroupsScreen');
    this.props.listAllUsers();
    this.props.listGroups();
    this.setState({ deleteModalOpen: false });
  }

  deleteModal = () => {
    if (this.state.deleteModalOpen) {
      return (
        <DeleteModal
          deleteModalOpen={this.state.deleteModalOpen}
          deleteFunc={this.deleteGroup}
          closeDeleteModal={this.closeDeleteModal}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }

  render() {
    const { loading, error: groupsError } = this.props.groupsState;
    const { loading: usersStateLoading, error: usersError } = this.props.usersState;

    if (loading || usersStateLoading) {
      return (
        <LoadingSpinner />
      );
    }
    return (
      <View style={[container, { justifyContent: 'space-evenly' }]}>
        <View style={{ flex: 1 }}>
          <Form
            ref={(c) => { this.formRef = c; }}
            type={group}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />
        </View>
        <View style={{ flex: 1 }}>
          {this.groupText()}
        </View>
        <TouchableOpacity style={[deleteContainer, { marginBottom: 20 }]} onPress={this.openDeleteModal}>
          <Text style={deleteText}> Delete </Text>
        </TouchableOpacity>
        {this.checkErrGrps(groupsError)}
        {this.checkErrUsrs(usersError)}
        {this.deleteModal()}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => (
  {
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    deleteGroup: user => dispatch(deleteGroup(user)),
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
