import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import {
  modalMessage,
  modalFooterButton,
  modalFooterText,
  modalContainer,
  modalFooterWrapper,
  modalHeader,
} from '../../styles/base';

type Props = {
  error: Object,
  clearError: Function,
  /**
   * we need currentFocusedScreen because react-navigation keeps the screens in the stack
   * mounted - if we didn't check which screen is in focus, all screens will render an err modal
   * and clobbering will happen.
   */
  currentFocusedScreen: Boolean,
}

export default class ErrorModal extends Component<Props> {
  state = {
    visibleModal: true,
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={modalFooterButton}>
        <Text style={modalFooterText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    if (this.props.error) {
      const msg = this.props.error.message;
      return (
        <View style={modalContainer}>
          <Text style={modalHeader}>
            Something went wrong
          </Text>
          <Text style={modalMessage}>
            {msg}
          </Text>
          <View style={[modalFooterWrapper, { justifyContent: 'center' }]}>
            {this.renderButton('Dismiss', () => {
              this.setState({ visibleModal: false });
              this.props.clearError();
            })}
          </View>
        </View>
      );
    }
  };

  render() {
    if (!this.props.currentFocusedScreen) {
      return null;
    }
    return (
      <Modal isVisible={this.state.visibleModal}>
        {this.renderModalContent()}
      </Modal>
    );
  }
}
