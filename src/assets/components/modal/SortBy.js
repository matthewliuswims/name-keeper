import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

import colors from '../../styles/colors';

import {
  modalContainer,
  modalHeader,
  modalMessage,
  modalFooterButton,
  modalFooterText,
  modalFooterWrapper,
} from '../../styles/base';

const sortOptions = [
  { option: 'Date: Old to New (default)' },
  { option: 'Date: New to Old' },
  { option: 'Alphabetical' },
];

export default class SortByModal extends Component {
  state = {
    visibleModal: true,
    selectedSortOption: this.props.sortOption,
  };

  renderFooterButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={modalFooterButton}>
        <Text style={modalFooterText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  radioButtons() {
    return (
      <FlatList
        style={{ marginBottom: (modalHeader.marginBottom * 2) }}
        data={sortOptions}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress = {() => {
              this.setState({
                selectedSortOption: item.option,
              });
            }}
          >
            <View style={styles.sortRow}>
              <Text style={styles.styleOption}> {item.option} </Text>
              <Icon
                name={
                  item.option === this.state.selectedSortOption ? 'radio-button-checked' : 'radio-button-unchecked'
                }
                color={item.option === this.state.selectedSortOption ? colors.appThemeColor : 'grey'}
              />
            </View>
          </TouchableOpacity>
        )}
        extraData={this.state}
        keyExtractor={(item => item.option)}
      />
    );
  }

  renderModalContent = () => {
    return (
      <View style={modalContainer}>
        <Text style={modalHeader}>
          Sort by
        </Text>
        <Text style={modalMessage}>
          Choose the order you want to see people
        </Text>
        {this.radioButtons()}
        <View style={modalFooterWrapper}>
          {this.renderFooterButton('Cancel', () => {
            this.setState({ visibleModal: false });
            this.props.closeSortModal(); // tell GroupScreen this modal is closed
          })}
          {this.renderFooterButton('Apply', () => {
            this.setState({ visibleModal: false });
            this.props.applySortModal(this.state.selectedSortOption); // tell GroupScreen this modal is closed
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
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp('1.5%'),
  },
});
