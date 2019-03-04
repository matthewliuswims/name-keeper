import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import RF from 'react-native-responsive-fontsize';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

import colors from '../../styles/colors';
import { cancelButtonText, horizontalGroupScreenButton, modalContentNormal, modalHeaderNormal } from '../../styles/base';

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

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  radioButtons() {
    return (
      <FlatList
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
                color={item.option === this.state.selectedSortOption ? 'green' : 'black'}
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
      <View style={modalContentNormal}>
        <View style={modalHeaderNormal}>
          <Icon
            onPress={() => {
              this.setState({ visibleModal: false });
              this.props.closeSortModal(); // tell GroupScreen this modal is closed
            }}
            name='close'
            size={wp('8%')}
            iconStyle={{
              marginRight: wp('16%'),
              padding: wp('2%'),
            }}
          />
          <Text style={styles.headerText}> Sort by </Text>
        </View>
        {this.radioButtons()}
        {this.renderButton('Apply', () => {
          this.setState({ visibleModal: false });
          this.props.applySortModal(this.state.selectedSortOption); // tell GroupScreen this modal is closed
        })}
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
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  headerText: {
    fontSize: RF(3.5),
    fontWeight: 'bold',
  },
  styleOption: {
    fontSize: RF(2.5),
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
