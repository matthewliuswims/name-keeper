import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { addUser } from '../../../redux/actions/users';

import { container, topRightSaveButton, topRightSaveButtonText, horizontalGroupScreenButton } from '../../styles/base';

import AddGroup from '../../components/groups/AddGroup';

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
  constructor(props) {
    super(props);
    this.state = {
      groups: this.sortedGroups(this.props.groupsState.groups, this.props.groupsState.focusedGroup),
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

  userSubmit = () => {
    const userStruct = this.formRef.getValue();
    if (userStruct) {
      const { name, location, description } = userStruct;
      console.log('this.state.groups', this.state.groups);

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
        const unfocusedGroup = Object.assign(clonedGroupTarget, { added: false });
        return unfocusedGroup;
      }
      focusedGroup = Object.assign(clonedGroupTarget, { added: true });
      return focusedGroup;
    });

    const noFocusGroup = withFocuses.filter(group => group.name !== focusedGroupName);

    noFocusGroup.unshift(focusedGroup);
    const sortedGroups = noFocusGroup; // want to make focused group first
    console.log('SORTEDD GROUPSSS', sortedGroups);
    return sortedGroups;
  }

  /**
   * sets state for groups, by modifiying the group that was clicked.
   * @param {string} groupname
   */
  groupClick(groupname) {
    this.setState((prevState) => {
      const { groups } = prevState;
      const updatedGroups = groups.map((group) => {
        if (group.name === groupname) {
          const clonedGroupTarget = Object.assign({}, group);
          return Object.assign(clonedGroupTarget, { added: !group.added });
        }
        return group;
      });
      console.log('updatedGroups is', updatedGroups);
      return { groups: updatedGroups };
    });
  }

  render() {
    // @tutorial: https://stackoverflow.com/questions/29363671/can-i-make-dynamic-styles-in-react-native
    // diegoprates
    return (
      <View style={styles.container}>
        <Form ref={(c) => { this.formRef = c; }} type={userForm} options={options} />
        <Text> Group(s) </Text>
        <FlatList
          data={this.state.groups}
          renderItem={({ item }) => (
            <AddGroup
              group={item}
              onGroupClick={groupName => this.groupClick(groupName)}
              getColorStyle={this.getColorStyle}
            />)
          }
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
    flex: horizontalGroupScreenButton.flex,
    flexDirection: horizontalGroupScreenButton.flexDirection,
    padding: horizontalGroupScreenButton.padding,
    borderRadius: horizontalGroupScreenButton.borderRadius,
    borderWidth: horizontalGroupScreenButton.borderWidth,
    borderColor: horizontalGroupScreenButton.borderColor,
    shadowColor: horizontalGroupScreenButton.shadowColor,
    shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    shadowRadius: horizontalGroupScreenButton.shadowRadius,
    shadowOffset: horizontalGroupScreenButton.shadowOffset,

    justifyContent: 'space-between',
    paddingLeft: wp('39%'),
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
