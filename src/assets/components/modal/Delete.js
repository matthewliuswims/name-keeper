import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

import colors from '../../styles/colors';

import {
  modalFooterButton,
  modalFooterText,
  modalHeader,
  modalMessage,
  modalContainer,
  modalFooterWrapper,
} from '../../styles/base';

export default class DeleteModal extends Component {
  renderFooterButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress} style={modalFooterButton}>
      <Text style={[modalFooterText, { color: colors.warningColor }]}>{text}</Text>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    return (
      <View style={modalContainer}>
        <Text style={modalHeader}>
          Are you sure?
        </Text>
        <Text style={modalMessage}>
          { this.props.deleteGroup
            ? 'You will delete this group and all its people. This process cannot be undone.'
            : 'You will delete this person from the group. This process cannot be undone.'
          }
        </Text>
        <View style={modalFooterWrapper}>
          {this.renderFooterButton('Cancel', this.props.closeDeleteModal)}
          {this.renderFooterButton('Delete', this.props.deleteFunc)}
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

DeleteModal.propTypes = {
  deleteModalOpen: PropTypes.bool.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  currentFocusedScreen: PropTypes.bool.isRequired,
  closeDeleteModal: PropTypes.func.isRequired,
  deleteGroup: PropTypes.bool,
};

DeleteModal.defaultProps = {
  deleteGroup: true,
};
