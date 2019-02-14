import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Icon } from 'react-native-elements';
import colors from '../../styles/colors';

import {
  cancelButton,
  cancelButtonText,
  deleteButton,
  deleteButtonText,
  modalMsg,
  modalContentDeleteConfirmation,
  modalHeader,
} from '../../styles/base';

export default class DeleteModal extends Component {
  renderCancel = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={cancelButton}>
        <Text style={cancelButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderDelete = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={deleteButton}>
        <Text style={deleteButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderCancel = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={cancelButton}>
        <Text style={cancelButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderDelete = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={deleteButton}>
        <Text style={deleteButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    return (
      <View style={modalContentDeleteConfirmation}>
        <Icon
          name='warning'
          color={colors.warningColor}
          size={wp('16%')}
        />
        <Text style={modalHeader}>
          Are you sure?
        </Text>
        <Text style={modalMsg}>
          { this.props.deleteGroup
            ? 'You will delete this group and all its people. This process cannot be done.'
            : 'You will delete this person from the group. This process cannot be done.'
          }
        </Text>
        <View style={styles.cancelDeleteContainer}>
          {this.renderCancel('Close', this.props.closeDeleteModal)}
          {this.renderDelete('Delete', this.props.deleteFunc)}
        </View>
      </View>
    );
  };

  render() {
    if (!this.props.currentFocusedScreen) {
      return null;
    }
    return (
      <Modal isVisible={this.props.deleteModalOpen}>
        {this.renderModalContent()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  cancelDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

DeleteModal.propTypes = {
  deleteModalOpen: PropTypes.bool.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  currentFocusedScreen: PropTypes.bool.isRequired,
  closeDeleteModal: PropTypes.func.isRequired,
  deleteGroup: PropTypes.bool,
};

DeleteModal.defaultProps = {
  deleteGroup: true,
}
