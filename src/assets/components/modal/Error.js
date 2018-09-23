import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  message: string,
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

  renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>{`
      We are Sorry! There was a problem.


      ${this.props.message}
      `}
      </Text>
      {this.renderButton('Close', () => this.setState({ visibleModal: false }))}
    </View>
  );

  render() {
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
