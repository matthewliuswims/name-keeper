// @flow
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import tComb from 'tcomb-form-native';
import { connect } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { addUser, clearUsersErr, listAllUsers } from '../../../redux/actions/users';
import { focusGroup } from '../../../redux/actions/groups';
import ErrorModal from '../../components/modal/Error';

import { container, groupIconNameContainer, topRightSaveButton, topRightSaveButtonText } from '../../styles/base';
import { getGroupColor } from '../../../lib/groupColors';
import colors from '../../styles/colors';

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
      value: null, // for form
      selectedGroupName: this.props.groupsState.focusedGroupName,
      groupsDropdownSelection: this.props.groupsState.groups, // selectedGroupName will always correspond to first group.
      groupDropdownOpen: false,
    };
  }


  getCircularColorStyle(groupColor) {
    const circularGroupIconNoColor = styles.circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
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

  resetFormValueState = async () => {
    this.setState({
      value: null,
    });
  }

  userSubmit = async () => {
    const userStruct = this.refs.form.getValue();

    if (userStruct) {
      const { name, location, description } = userStruct;

      const user = {
        name,
        description,
        location,
        primaryGroupName: this.state.selectedGroupName,
      };

      await this.props.addUser(user);
      if (!this.props.usersState.error) {
        await this.props.listAllUsers();
      } // else, we wait for the errModal to popup here
      if (!this.props.usersState.error) {
        this.props.focusGroup(this.state.selectedGroupName);
        await this.resetFormValueState();
        this.props.navigation.navigate('GroupScreen', {
          groupName: this.state.selectedGroupName,
        });
      } // else, we wait for the errModal to popup here
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

  otherGroupClick = (group) => {
    this.setState((state) => {
      const copyGroupsDropdownSelection = state.groupsDropdownSelection.slice();
      const noClickedGroup = copyGroupsDropdownSelection.filter(grp => grp.name !== group.name);
      noClickedGroup.unshift(group);

      return {
        groupDropdownOpen: !state.groupDropdownOpen,
        groupsDropdownSelection: noClickedGroup,
        selectedGroupName: group.name,
      };
    });
  }

  /**
   * @param {Array<Object>} groupsDropdownSelection - ordered groups from dropdown perspective
   * @return all groups that are not currently selected.
   */
  otherGroups(groupsDropdownSelection) {
    const groupsCopy = groupsDropdownSelection.slice();
    if (groupsCopy.length <= 1 || !this.state.groupDropdownOpen) {
      return null; // if not open, don't show
    }
    groupsCopy.shift();

    return (
      <FlatList
        data={groupsCopy}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.otherGroupSelection}
            onPress={() => { this.otherGroupClick(item); }}
          >
            <View style={styles.groupIconNameContainer}>
              <View style={this.getCircularColorStyle(getGroupColor(item.name, groupsCopy))} />
              <Text numberOfLines={1}> {item.name} </Text>
            </View>
            <Icon
              name='keyboard-arrow-down'
              color='#F2F2F2'
            />
          </TouchableOpacity>)
        }
        keyExtractor={(item => `${item.groupID}`)}
      />
    );
  }

  /**
   * @param {Array<Object>} groupsDropdownSelection - ordered groups from dropdown perspective
   */
  selectedGroup(groupsDropdownSelection) {
    return (
      <TouchableOpacity
        style={styles.initialGroupSelection}
        onPress={() => {
          this.setState((state) => {
            return { groupDropdownOpen: !state.groupDropdownOpen };
          });
        }
        }
      >
        <View style={styles.groupIconNameContainer}>
          <View style={this.getCircularColorStyle(getGroupColor(this.state.selectedGroupName, groupsDropdownSelection))} />
          <Text numberOfLines={1}> {this.state.selectedGroupName} </Text>
        </View>
        <Icon
          name='keyboard-arrow-down'
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { groupsDropdownSelection } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            groupDropdownOpen: false,
          });
        }}
      >
        <View style={container}>
          <Form
            ref='form'
            type={userForm}
            value={this.state.value}
            onChange={this.onChange}
            options={options}
          />
          <Text style={styles.groupText}> Group </Text>
          <View style={styles.groupsSection}>
            {this.selectedGroup(groupsDropdownSelection)}
            {this.otherGroups(groupsDropdownSelection)}
          </View>
          {this.checkErrUsrs(this.props.usersState.error)}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  groupText: {
    fontWeight: '500',
    fontSize: 17,
  },
  groupIconNameContainer: {
    flex: groupIconNameContainer.flex,
    flexDirection: groupIconNameContainer.flexDirection,
    paddingTop: hp('0.5%'),
  },
  circularGroupIcon: {
    height: wp('4%'),
    width: wp('4%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
    marginLeft: wp('2%'),
  },
  groupsSection: {
    // borderWidth: 0.75,
    // borderColor: colors.borderColor,
    marginTop: hp('1%'),
  },
  initialGroupSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.75,
    borderColor: 'black',
  },
  otherGroupSelection: {
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 0.75,
    borderRightWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: colors.borderColor,
  },
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
    focusGroup: grpName => dispatch(focusGroup(grpName)),
    listAllUsers: () => dispatch(listAllUsers()),
    clearUsersErr: () => dispatch(clearUsersErr()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen);
