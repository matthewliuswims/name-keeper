import React, { Component } from 'react';
import { Text, View, Button, FlatList, StyleSheet } from 'react-native';
import RightHeaderComponent from '../../components/screen/RightHeaderComponent';

type Props = {
  navigation: () => void,
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default class GroupsScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Groups',
    headerTitleStyle: {
      color: 'white',
    },
    headerRight: <RightHeaderComponent />,
  };

  render() { // make flat list it's own component
    return (
      <View>
        <Text>Groups Screen yahz</Text>
        <FlatList
          data={
            [
              { key: 'Work' },
              { key: 'Jazz Band' },
              { key: 'Swimming' },
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
      </View>
    );
  }
}
