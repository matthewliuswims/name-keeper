import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

type Props = {
  username: string,
  userDescription: string,
  date: string,
};

export default class UserBox extends React.Component <Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText} numberOfLines={1}> {this.props.username} </Text>
        <View style={styles.descriptionAndDate}>
          <Text numberOfLines={1}> {this.props.userDescription} </Text>
          <Text numberOfLines={1}> {this.props.date} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontWeight: 'bold',
  },
  container: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  descriptionAndDate: {
    flex: 1, // if uncomment, you'll see difference
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});
