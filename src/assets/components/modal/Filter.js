import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';

import AddGroup from '../groups/GroupFilterRow';

import {
  modalFooterText,
  circularGroupIcon,
  innardsStyleContainer,
  modalContainer,
  modalHeader,
  modalMessage,
  modalFooterButton,
  modalFooterWrapper,
} from '../../styles/base';


export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredGroups: this.props.filteredGroups,
      visibleModal: true,
    };
  }

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

  renderFooterButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={modalFooterButton}>
        <Text style={modalFooterText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  // NOTE: a lot of shared logic with AddUserScreen, can eventually refactor
  allGroups() {
    return (
      <FlatList
        style={{ marginBottom: (modalHeader.marginBottom * 2) }}
        data={this.state.filteredGroups}
        renderItem={({ item }) => (
          <AddGroup
            group={item}
            onGroupClick={groupName => this.groupClick(groupName)}
            getColorStyle={this.getColorStyle}
            innardsStyleContainer={innardsStyleContainer}
          />
        )
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
      <View style={modalContainer}>
        <Text style={modalHeader}>
          Filter by
        </Text>
        <Text style={modalMessage}>
          Choose the people from the groups you want to see
        </Text>
        {this.allGroups()}
        <View style={modalFooterWrapper}>
          {this.renderFooterButton('Cancel', () => {
            this.setState({ visibleModal: false });
            this.props.closeFilterModal(this.state.filteredGroups); // tell GroupScreen this modal is closed
          })}
          {this.renderFooterButton('Apply', () => {
            this.setState({ visibleModal: false });
            this.props.applyFilterModal(this.state.filteredGroups); // tell GroupScreen this modal is closed
          })}
        </View>
      </View>
    );
  };

  render() {
    return (
      <Modal isVisible={this.state.visibleModal}>
        {this.renderModalContent()}
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
});
