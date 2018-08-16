import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import RightHeaderComponent from '../components/screen/RightHeaderComponent';
import LeftHeaderComponent from '../components/screen/LeftHeaderComponent';

export default class UserScreen extends Component {
  static navigationOptions = {
    title: 'GROUPS STUFFF',
    headerRight: <RightHeaderComponent />,
    headerLeft: <LeftHeaderComponent />,
  };

  render() {
    return (
      <View>
        <Text>a user</Text>
        <Button
          title="Go to group screen via navigate"
          onPress={() => this.props.navigation.navigate('GroupsScreen')}
        />
        <Button
          title="Go to group screen via push (notice how back button is avialale)"
          onPress={() => this.props.navigation.push('GroupsScreen')}
        />
      </View>
    );
  }
}
