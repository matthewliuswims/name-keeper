// @flow
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { addUser, clearUsersErr, listAllUsers } from '../../../redux/actions/users';

import ErrorModal from '../../components/modal/Error';

import { container, topRightSaveButton, topRightSaveButtonText, circularGroupIcon } from '../../styles/base';

type Props = {
  navigation: () => void,
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
      value: null,
    };
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
        <TouchableOpacity onPress={navigation.getParam('userSubmit') || noOp} style={styles.saveButton}>
          <Text style={styles.saveButtonText}> Save</Text>
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ userSubmit: this.userSubmit });
  }

  userSubmit = async () => {
    const userStruct = this.refs.form.getValue();

    if (userStruct) {
      const { name, location, description } = userStruct;

      const user = {
        name,
        description,
        location,
        primaryGroupName: this.props.groupsState.focusedGroupName,
      };

      await this.props.addUser(user);
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
      <View style={container}>
        <Form
          ref='form'
          type={userForm}
          value={this.state.value}
          onChange={this.onChange}
          options={options}
        />
        {this.checkErrUsrs(this.props.usersState.error)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  groups: {
    marginTop: hp('2%'),
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
    addUser: user => dispatch(addUser(user)),
    listAllUsers: () => dispatch(listAllUsers()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen);
