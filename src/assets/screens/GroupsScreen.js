import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import RightHeaderComponent from '../components/screen/RightHeaderComponent';
import LeftHeaderComponent from '../components/screen/LeftHeaderComponent';

export default class GroupsScreen extends Component {

  static navigationOptions = {
    title: 'GROUPS STUFFF',
    headerRight: <RightHeaderComponent />,
  };

  render() {
    return (
      <View>
        <Text>Groups Screen yahz</Text>
        <Button onPress = {() => this.props.navigation.navigate('UsersScreen',
        {id: 86, details: 'yeah'})} 
        title = 'Go to users screen' />
      </View>
    );
  }
}
