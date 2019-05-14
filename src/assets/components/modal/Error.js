import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { modalMsg, cancelButton, cancelButtonText, modalContentDeleteConfirmation } from '../../styles/base';

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
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    if (this.props.error) {
      const msg = this.props.error.message;
      return (
        <View style={modalContentDeleteConfirmation}>
          <Text style={modalMsg}>
            {msg}
          </Text>
          {this.renderButton('Close', () => {
            this.setState({ visibleModal: false });
            this.props.clearError();
          })}
        </View>
      );
    }
  };

  render() {
    if (!this.props.currentFocusedScreen) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Modal isVisible={this.state.visibleModal}>
          {this.renderModalContent()}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: cancelButton,
  buttonText: cancelButtonText,
});
