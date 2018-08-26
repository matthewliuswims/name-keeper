import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import LeftHeaderComponent from '../../components/screen/LeftHeaderComponent';
import { container } from '../../styles/base';

export default class UserScreen extends Component {
  static navigationOptions = {
    title: 'User Screen',
    headerRight: <RightHeaderComponent />,
    headerLeft: <LeftHeaderComponent />,
  };

  render() {
    return (
      <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
