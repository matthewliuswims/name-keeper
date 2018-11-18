import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import getErrMsg from '../../../lib/errors/errors';
import { PLACE_HOLDER_DEFAULT } from '../../../lib/errors/overrides';

type Props = {
  error: Object,
  clearError: Function,
  overrides?: Object,
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
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    if (this.props.error) {
      const msg = getErrMsg(this.props.error, this.props.overrides);
      return (
        <View style={styles.modalContent}>
          <Text>
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
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

ErrorModal.defaultProps = {
  overrides: PLACE_HOLDER_DEFAULT,
};
