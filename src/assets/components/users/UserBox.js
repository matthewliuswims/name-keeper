import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
// import { } from '../../styles/group';

type Props = {
  username: string,
  userDescription: string,
  date: string,
};

export default class UserBox extends React.Component <Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}> {this.props.username} </Text>
        <View style={styles.descriptionAndDate}>
          <Text> {this.props.userDescription} </Text>
          <Text> {this.props.date} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingTop: 5, // @TODO: make this dynamic
    paddingBottom: 5,
  },
  descriptionAndDate: {
    flex: 1, // if uncomment, you'll see difference
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});
