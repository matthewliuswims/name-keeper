import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';


import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import ErrorModal from '../../components/modal/Error';

import { container, topRightSaveButton, topRightSaveButtonText } from '../../styles/base';

import { editGroup, listGroups } from '../../../redux/actions/groups';
import { listAllUsers } from '../../../redux/actions/users';

type Props = {
  navigation: () => void,
  addGroup: () => void,
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
          <View style={styles.saveButton}>
            <Text style={styles.saveButtonText}> Save</Text>
          </View>
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ groupSubmit: this.groupSubmit });
  }

  checkErr = (err) => {
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
      await this.props.editGroup(this.props.groupsState.focusedGroupName, newGroupName); //
      await this.props.listGroups();
      await this.props.listAllUsers();
      this.props.navigation.navigate('GroupsScreen');
    }
  }

  render() {
    return (
      <View style={container}>
        <View>
          <Form ref={(c) => { this.formRef = c; }} type={group} options={options} />
        </View>
        {this.checkErr(this.props.groupsState.error)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saveButton: {
    paddingLeft: topRightSaveButton.paddingLeft,
    paddingRight: topRightSaveButton.paddingRight,
    backgroundColor: topRightSaveButton.backgroundColor,
  },
  saveButtonText: {
    color: topRightSaveButtonText.color,
    fontWeight: topRightSaveButtonText.fontWeight,
  },
});

const mapDispatchToProps = dispatch => (
  {
    listGroups: () => dispatch(listGroups()),
    listAllUsers: () => dispatch(listAllUsers()),
    editGroup: (currentGroupName, newGroupName) => dispatch(editGroup(currentGroupName, newGroupName)),
  }
);

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupScreen);
