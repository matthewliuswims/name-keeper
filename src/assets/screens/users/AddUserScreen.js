import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';

import { addUser } from '../../../redux/actions/users';

import { container, topRightSaveButton, topRightSaveButtonText, horizontalGroupScreenButton } from '../../styles/base';

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
      console.log('this.props.groupsState', this.props.groupsState);
      const { groups } = this.props.groupsState;

      // let groupColorIds = [];
  
      // groups.map((group) => {
      //   group.color = 
      // })

      console.log('userStruct', userStruct);
      console.log('name is', name);
      console.log('location is', location);
      console.log('description is', description);
    }
  }

  getColorStyle(groupColor) {
    const buttonNoColorStyle = styles.button;
    const buttonColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([buttonNoColorStyle, buttonColor]); 
    return combinedStyle;
  }

  render() {
    // @tutorial: https://stackoverflow.com/questions/29363671/can-i-make-dynamic-styles-in-react-native
    // diegoprates

    return (
      <View style={styles.container}>
        <Form ref={(c) => { this.formRef = c; }} type={userForm} options={options} />
        <Text> Group(s) </Text>
        <FlatList
          data={this.props.groupsState.groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={this.getColorStyle(item.color)}
              onPress = {() => {
                console.log('colorrr here', item.color);
              }}
            >
              <Text> Add Group -----X </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item => `${item.group_id}`)}
        />
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
    alignItems: horizontalGroupScreenButton.alignItems,
    padding: horizontalGroupScreenButton.padding,
    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
    shadowColor: horizontalGroupScreenButton.shadowColor,
    shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    shadowRadius: horizontalGroupScreenButton.shadowRadius,
    shadowOffset: horizontalGroupScreenButton.shadowOffset,
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
