import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { container } from '../../styles/base';

import Footer from '../../components/footer/footer';

export default class GroupScreen extends Component {
  static navigationOptions = {
    title: 'Group Screen',
    headerBackTitle: null, // @TODO change
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.groupContents}>
          <Text>a group </Text>
        </View>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    backgroundColor: container.backgroundColor,
  },
  groupContents: {
    flex: 11,
  },
  footer: {
    flex: 1,
  },
});
