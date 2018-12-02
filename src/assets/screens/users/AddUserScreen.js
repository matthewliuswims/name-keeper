// @flow
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { get } from 'lodash';

import { addUser, clearUsersErr, listAllUsers } from '../../../redux/actions/users';

import ErrorModal from '../../components/modal/Error';


import { container, topRightSaveButton, topRightSaveButtonText, horizontalGroupScreenButton } from '../../styles/base';
import { groupValidationFail, clearGroupsErr } from '../../../redux/actions/groups';
import AddGroup from '../../components/groups/AddGroup';

import { MORE_THAN_3_GROUPS, NO_GROUPS_SELECTED } from '../../../lib/errors/overrides';

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

// @TODO: investigate whether or not we will have bugs because
// we only initialize this.state.groups in constructor once...
class AddUserScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      groups: this.sortedGroups(this.props.groupsState.groups, this.props.groupsState.focusedGroupName),
      errorOverrides: null,
    };
  }

  /**
   * @tutorial https://reactnavigation.org/docs/en/header-buttons.html#header-interaction-with-its-screen-component
   * for onPress we need a noOp, otherwise we'd get an error, because React Navigation does NOT guarantee
   * that the screen component will be mounted before the header.
   */
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add User Screen',
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

  componentDidMount() {
    this.props.navigation.setParams({ userSubmit: this.userSubmit });
  }

  /**
   * groupClick should guarantee that groups should never have more than 3 added groups
   */
  get3GroupsForUser(groups) {
    const threeGroups = [];
    for (const group of groups) {
      if (group.added) {
        threeGroups.push(group);
      }
    }
    // hopefully threeGroups will NOT be over 3 lol
    while (threeGroups.length !== 3) {
      threeGroups.push(null);
    }
    return threeGroups;
  }

  validGroupSelections() {
    let groupCounter = 0;
    for (const group of this.state.groups) {
      if (group.added) groupCounter++;
    }

    if (groupCounter === 0) {
      const noGroupsSelected = new Error();
      this.props.groupValidationFail(noGroupsSelected);
      this.setState({
        errorOverrides: NO_GROUPS_SELECTED,
      });
      return false;
    }

    if (groupCounter > 3) {
      const moreThan3Groups = new Error();
      this.props.groupValidationFail(moreThan3Groups);
      this.setState({
        errorOverrides: MORE_THAN_3_GROUPS,
      });
      return false;
    }
    return true;
  }

  userSubmit = async () => {
    if (!this.validGroupSelections()) {
      return;
    }
    const userStruct = this.refs.form.getValue();
    const threeGroups = this.get3GroupsForUser(this.state.groups); // @TODO: do something with this
    console.log('threeGroups', threeGroups);
    if (userStruct) {
      const { name, location, description } = userStruct;

      const groupNameOne = get(threeGroups[0], 'name', null);
      const groupNameTwo = get(threeGroups[1], 'name', null);
      const groupNameThree = get(threeGroups[2], 'name', null);

      const user = {
        name,
        description,
        groupNameOne,
        groupNameTwo,
        groupNameThree,
        location,
      };

      this.setState({
        errorOverrides: null,
      });

      await this.props.addUser(user);
      await this.props.listAllUsers();
      this.props.navigation.navigate('GroupScreen');
    }
  }

  getColorStyle(groupColor, opacity) {
    const buttonNoColorStyle = styles.button;
    const buttonColor = {
      backgroundColor: groupColor,
      opacity,
    };
    const combinedStyle = StyleSheet.flatten([buttonNoColorStyle, buttonColor]);
    return combinedStyle;
  }

  /**
   * CALLED in constructor.
   * by sorted, we just mean that the current/focused group that we are in
   * is first in the list - else the list group is preserved.
   * we also added a 'added' boolean.
   */
  sortedGroups(groupsOriginal, focusedGroupName) {
    const groups = groupsOriginal.slice(); // because we mutate in filter logic

    let focusedGroup;

    const withFocuses = groups.map((group) => {
      const clonedGroupTarget = Object.assign({}, group);
      if (group.name !== focusedGroupName) {
        const unfocusedGroup = Object.assign(clonedGroupTarget, { added: false, opacity: 0.3 });
        return unfocusedGroup;
      }
      focusedGroup = Object.assign(clonedGroupTarget, { added: true, opacity: 1, isFocusedGroup: true });
      return focusedGroup;
    });

    const noFocusGroup = withFocuses.filter(group => group.name !== focusedGroupName);

    noFocusGroup.unshift(focusedGroup);
    const sortedGroups = noFocusGroup; // want to make focused group first
    return sortedGroups;
  }

  /**
   * sets state for groups, by modifiying the group that was clicked.
   * @param {string} groupname
   */
  groupClick(groupname) {
    console.log('groupclick yah');
    this.setState((prevState) => {
      const { groups } = prevState;
      const updatedGroups = groups.map((group) => {
        if (group.name === groupname) {
          const clonedGroupTarget = Object.assign({}, group);
          const added = !group.added;
          const opacity = added ? 1 : 0.3;
          return Object.assign(clonedGroupTarget, { added, opacity });
        }
        return group;
      });
      return { groups: updatedGroups };
    });
  }


  checkErrGrps = (err) => {
    // don't want err to render if we're not even on the screen
    if (err) {
      return (
        <ErrorModal
          error={err}
          clearError={this.props.clearGroupsErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
          overrides={this.state.errorOverrides}
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
    // @tutorial: https://stackoverflow.com/questions/29363671/can-i-make-dynamic-styles-in-react-native
    // diegoprates
    return (
      <View style={styles.container}>
        <Form
          ref='form'
          type={userForm}
          value={this.state.value}
          onChange={this.onChange}
          options={options}
        />
        <Text> Group(s) </Text>
        <FlatList
          data={this.state.groups}
          renderItem={({ item }) => (
            <AddGroup
              group={item}
              onGroupClick={groupName => this.groupClick(groupName)}
              getColorStyle={this.getColorStyle}
              innardsStyleContainer={styles.buttonInnardsContainer}
            />)
          }
          keyExtractor={(item => `${item.groupID}`)}
        />
        {this.checkErrGrps(this.props.groupsState.error)}
        {this.checkErrUsrs(this.props.usersState.error)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    paddingLeft: container.paddingLeft,
    paddingRight: container.paddingRight,
    backgroundColor: container.backgroundColor,
  },
  button: {
    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
    shadowColor: horizontalGroupScreenButton.shadowColor,
    shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    shadowRadius: horizontalGroupScreenButton.shadowRadius,
    shadowOffset: horizontalGroupScreenButton.shadowOffset,
  },
  buttonInnardsContainer: {
    padding: 2,
    flex: horizontalGroupScreenButton.flex,
    flexDirection: horizontalGroupScreenButton.flexDirection,
    justifyContent: 'space-between',
  },
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


const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
  }
);
const mapDispatchToProps = dispatch => (
  {
    addUser: user => dispatch(addUser(user)),
    listAllUsers: () => dispatch(listAllUsers),
    groupValidationFail: err => dispatch(groupValidationFail(err)),
    clearGroupsErr: () => dispatch(clearGroupsErr()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen);
