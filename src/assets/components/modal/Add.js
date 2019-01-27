import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import RF from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';

import colors from '../../styles/colors';
import { cancelButtonText, horizontalGroupScreenButton } from '../../styles/base';


export default class AddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredGroups: this.props.filteredGroups,
      visibleModal: true,
    };
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Icon
            onPress={() => {
              this.setState({ visibleModal: false });
              this.props.closeAddModal(); // tell GroupScreen this modal is closed
            }}
            name='close'
            size={wp('8%')}
            iconStyle={{
              marginRight: wp('16%'),
            }}
          />
          <Text style={styles.headerText}> Choose to </Text>
        </View>
        <View style={styles.buttons}>
          {this.renderButton('Add Person', () => {
            this.setState({ visibleModal: false });
            this.props.addUser();
          })}
          {this.renderButton('Add Group', () => {
            this.setState({ visibleModal: false });
            this.props.addGroup();
          })}
        </View>
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

AddModal.propTypes = {
  closeAddModal: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  addGroup: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingBottom: hp('2%'),
    marginBottom: hp('2%'),
  },
  headerText: {
    fontSize: RF(3.5),
    fontWeight: 'bold',
  },
  buttonsOpt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingLeft: wp('7%'),
    paddingRight: wp('7%'),
    margin: wp('1%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),

    flexGrow: 1,
    backgroundColor: colors.addApplyColor,
    borderColor: horizontalGroupScreenButton.borderColor,
    borderWidth: 1,
    justifyContent: 'center',
    flexDirection: 'row',

    borderRadius: horizontalGroupScreenButton.borderRadius,

    // borderColor: horizontalGroupScreenButton.borderColor,
    // shadowColor: horizontalGroupScreenButton.shadowColor,
    // shadowOpacity: horizontalGroupScreenButton.shadowOpacity,
    // shadowRadius: horizontalGroupScreenButton.shadowRadius,
    // shadowOffset: horizontalGroupScreenButton.shadowOffset,
  },
  buttonText: cancelButtonText,
  modalContent: {
    height: hp('20%'),
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
