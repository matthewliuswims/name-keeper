
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import t from 'tcomb-form-native';
import { connect } from 'react-redux';

import ErrorModal from '../../components/modal/Error';

import { container, topRightSaveButton, topRightSaveButtonText } from '../../styles/base';
import { addGroup, listGroups } from '../../../redux/actions/groups';


type Props = {
  navigation: () => void,
  addGroup: () => void,
};

const { Form } = t.form;

const group = t.struct({
  name: t.String,
});

const options = {
  fields: {
    name: {
      error: 'Please enter a group name',
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

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.saveButton}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  groupSubmit = () => {
    const groupStruct = this.formRef.getValue();
    // remember below Form type is group
    const { name: groupName } = groupStruct;
    if (groupName) {
      this.props.addGroup(groupName).then(() => {
        this.props.listGroups();
      }).then(() => {
        this.props.navigation.navigate('GroupsScreen');
      }).catch(() => {
        // redux will already have error, which will boil error up to UI via modal
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Form ref={(c) => { this.formRef = c; }} type={group} options={options} />
        </View>
        {this.props.groupsState.error && <ErrorModal message={this.props.groupsState.error.message} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
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

const mapDispatchToProps = dispatch => (
  {
    addGroup: groupName => dispatch(addGroup(groupName)),
    listGroups: () => dispatch(listGroups()),
  }
);

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupScreen);
