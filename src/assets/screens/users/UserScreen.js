import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';

export default class UserScreen extends Component {


  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('username'),
      headerRight: <RightHeaderComponent />,
      headerBackTitle: null,
    };
  };

  render() {
    const { navigation } = this.props;
    const username = navigation.getParam('username');

    return (
      <View style={styles.container}>
        <View style={styles.userDateRow}>
          <Text>user name is: {username}</Text>
          <Text>date</Text>
        </View>
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
  userDateRow: {
    flex: container.flex,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
