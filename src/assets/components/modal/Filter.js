import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import RF from 'react-native-responsive-fontsize';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

import AddGroup from '../groups/GroupFilterRow';
import colors from '../../styles/colors';
import { cancelButtonText, horizontalGroupScreenButton, circularGroupIcon, innardsStyleContainer, modalContentNormal, modalHeaderNormal } from '../../styles/base';


export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredGroups: this.props.filteredGroups,
      visibleModal: true,
    };
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * sets state for groups, by modifiying the group that was clicked.
   * @param {string} groupname
   */
  groupClick(groupname) {
    this.setState((prevState) => {
      const { filteredGroups } = prevState;
      const updatedGroups = filteredGroups.map((group) => {
        if (group.name === groupname) {
          const clonedGroupTarget = Object.assign({}, group);
          const added = !group.added;
          const opacity = added ? 1 : 0.3;
          return Object.assign(clonedGroupTarget, { added, opacity });
        }
        return group;
      });
      return { filteredGroups: updatedGroups };
    });
  }

  // NOTE: a lot of shared logic with AddUserScreen, can eventually refactor
  allGroups() {
    return (
      <FlatList
        data={this.state.filteredGroups}
        renderItem={({ item }) => (
          <AddGroup
            group={item}
            onGroupClick={groupName => this.groupClick(groupName)}
            getColorStyle={this.getColorStyle}
            innardsStyleContainer={innardsStyleContainer}
          />)
        }
        keyExtractor={(item => `${item.groupID}`)}
      />
    );
  }

  // is also in AddUserScreen...eventually refactor
  getColorStyle(groupColor, opacity) {
    const circularGroupIconNoColor = styles.circularGroupIcon;
    const circularGroupIconWithColor = {
      backgroundColor: groupColor,
      opacity,
    };
    const combinedStyle = StyleSheet.flatten([circularGroupIconNoColor, circularGroupIconWithColor]);
    return combinedStyle;
  }

  renderModalContent = () => {
    return (
      <View style={modalContentNormal}>
        <View style={modalHeaderNormal}>
          <Icon
            onPress={() => {
              this.setState({ visibleModal: false });
              this.props.closeFilterModal(this.state.filteredGroups); // tell GroupScreen this modal is closed
            }}
            name='close'
            size={wp('8%')}
            iconStyle={{
              marginRight: wp('6%'),
              padding: wp('2%'),
            }}
          />
          <Text style={styles.headerText}> Filter by Groups</Text>
        </View>
        {this.allGroups()}
        {this.renderButton('Apply', () => {
          this.setState({ visibleModal: false });
          this.props.applyFilterModal(this.state.filteredGroups); // tell GroupScreen this modal is closed
        })}
      </View>
    );
  };

  render() {
    return (
      <Modal isVisible={this.state.visibleModal}>
        {this.renderModalContent(this.state.filteredGroups)}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  circularGroupIcon: {
    height: circularGroupIcon.height,
    width: circularGroupIcon.width,
    borderRadius: circularGroupIcon.borderRadius,
    marginRight: circularGroupIcon.marginRight,
    // we do NOT get margin left from circularGroupIcon
  },
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: RF(3.5),
    fontWeight: 'bold',
  },
  button: {
    paddingLeft: wp('7%'),
    paddingRight: wp('7%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),

    backgroundColor: colors.addApplyColor,

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
  buttonText: cancelButtonText,
});
