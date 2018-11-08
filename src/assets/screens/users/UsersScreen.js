import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { container } from '../../styles/base';

// THIS WILL PROBABLY NOT BE NEEDED - KEEPING IT HERE AS REFFERENCE FOR NAVIGATION
export default class UsersScreen extends Component {
  static navigationOptions = {
    title: 'Users Screen',
  };

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id', 'NO-ID');
    const otherParam = navigation.getParam('details', 'some default value');
    return (
      <View style={styles.container}>
        <Text>UsersScreen UsersScreen</Text>
        <Text> itemId: {JSON.stringify(itemId)} </Text>
        <Text>otherParam: {JSON.stringify(otherParam)} </Text>

        <Button
          title="Go to user screen"
          onPress={() => this.props.navigation.navigate('UserScreen')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
  },
});
