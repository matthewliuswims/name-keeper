import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';
import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';

type Props = {
  navigation: () => void,
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
  },
});

export default class GroupsScreen extends Component<Props> {

  static navigationOptions = {
    title: 'Groups',
    headerRight: <RightHeaderComponent />,
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  // use arrow functions
  // do key value pairs ventually
  async storeData(userId) {
    try {
      await AsyncStorage.setItem(userId, userId);
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  }

  // userId is a string
  async getData(userId) {
    try {
      const returnVal = await AsyncStorage.getItem(userId);
      return returnVal;
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  }

  render() { // make flat list it's own component
    return (
      <View style={styles.container}>
        <Text>Groups Screen hi yahz</Text>
        <FlatList
          data={
            [
              { key: 'Work' },
              { key: 'Jazz Band' },
              { key: 'Swimming' },
              { key: '1' },
              { key: '2' },
              { key: '3' },
              { key: '4' },
              { key: '5' },
              { key: '6' },
              { key: '7' },
              { key: '8' },
              { key: '9' },
            ]
          }
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        />
        <Button
          onPress = {() => this.props.navigation.navigate('UsersScreen',
            {
              id: 86,
              details: 'yeah',
            })}
          title = 'Go to users screen'
        />

        <Button
          onPress = {() => this.storeData('hi')}
          title = 'Store Data'
        />

        <Button
          onPress = {() => this.getData('hi')}
          title = 'get Data'
        />

        <Button
          onPress = {() => this.props.navigation.navigate('AddGroupScreen')}
          title = 'Go to add group screen'
        />

      </View>
    );
  }
}
