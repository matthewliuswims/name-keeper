import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class UsersScreen extends Component {
  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id', 'NO-ID');
    const otherParam = navigation.getParam('details', 'some default value');
    return (
      <View>
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
