import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import ErrorModal from '../../components/modal/Error';

import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';

import {
  container,
  topRightTextButtonContainerSolo,
  topRightButtonText,
  addMessage,
} from '../../styles/base';
import {
  addGroup,
  listGroups,
  clearGroupsErr,
  focusGroup,
} from '../../../redux/actions/groups';

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
      title: 'Add Group',
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

  groupSubmit = () => {
    const { navigation } = this.props;
    const fromAddUserScreen = navigation.getParam('fromAddUserScreen', '');
    /**
     * Calling getValue will cause the validation of all the fields of the form,
     *  including some side effects like highlighting the errors.
     * @tutorial https://github.com/gcanti/tcomb-form-native
     */
    if (!this.formRef) return;
    const groupStruct = this.formRef.getValue();
    // remember below Form type is group
    if (groupStruct) {
      const { name: unparsedName } = groupStruct;
      const groupName = unparsedName.trim();
      this.props.addGroup(groupName).then(() => {
        if (!this.props.groupsState.error) {
          this.props.listGroups().then(
            () => {
              if (fromAddUserScreen) {
                this.props.focusGroup(groupName);
                const backAction = NavigationActions.back();
                this.props.navigation.dispatch(backAction);
                return;
              }
              this.props.focusGroup(groupName);
              const resetAction = StackActions.reset({
                index: 1,
                actions: [
                  NavigationActions.navigate({ routeName: 'GroupsScreen' }),
                  NavigationActions.navigate({ routeName: 'GroupScreen' }),
                ],
              });
              this.props.navigation.dispatch(resetAction);
            },
          ); // update redux from sql
        }
      });
    }
  }

  groupText() {
    return (
      <Text style={addMessage}>
        Hint: A group is usually a community you are part of (e.g. Work or Church).
      </Text>
    );
  }

  render() {
    const { loading, error } = this.props.groupsState;
    if (loading) {
      return (
        <LoadingSpinner />
      );
    }
    return (
      <View style={container}>
        <Form ref={(c) => { this.formRef = c; }} type={group} options={options} />
        {this.groupText()}
        {this.checkErr(error)}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => (
  {
    addGroup: groupName => dispatch(addGroup(groupName)),
    listGroups: () => dispatch(listGroups()),
    focusGroup: groupName => dispatch(focusGroup(groupName)),
    clearGroupsErr: () => dispatch(clearGroupsErr()),
  }
);

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupScreen);
