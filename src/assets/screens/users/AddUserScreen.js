import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import { addUser } from '../../../redux/actions/users';
import { container, topRightSaveButton, topRightSaveButtonText, horizontalScreenButton } from '../../styles/base';

type Props = {
  navigation: () => void,
  groupsState : {
    groups: Array<Object>,
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

class AddUserScreen extends Component<Props> {
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

  userSubmit = () => {
    const userStruct = this.formRef.getValue();
    if (userStruct) {
      const { name, location, description } = userStruct;

      // const user = {
      //   name,
      //   description,
      //   last_edit: Date.now(),
      //   location,
      // };

      console.log('userStruct', userStruct);
      console.log('name is', name);
      console.log('location is', location);
      console.log('description is', description);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Form ref={(c) => { this.formRef = c; }} type={userForm} options={options} />
        <Text> Group(s) </Text>
        <TouchableOpacity
          style={styles.button}
          onPress = {() => console.log('am work')}
        >
          <Text> Add Group </Text>
        </TouchableOpacity>
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
    backgroundColor: 'blue',

    alignItems: horizontalScreenButton.alignItems,
    padding: horizontalScreenButton.padding,
    borderRadius: horizontalScreenButton.borderRadius,
    borderWidth: horizontalScreenButton.borderWidth,
    borderColor: horizontalScreenButton.borderColor,
    shadowColor: horizontalScreenButton.shadowColor,
    shadowOpacity: horizontalScreenButton.shadowOpacity,
    shadowRadius: horizontalScreenButton.shadowRadius,
    shadowOffset: horizontalScreenButton.shadowOffset,
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
  }
);
const mapDispatchToProps = dispatch => (
  {
    addUser: user => dispatch(addUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen);
