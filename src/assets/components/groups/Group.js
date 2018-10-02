import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { groupContainerStyle, groupTextStyle } from '../../styles/group';
// given an id, have to be able to find the group and first 2 users (might as well just find all users)
// or maybe not...
// and put into redux state...
// just start by loading all the users...
// naive way first
// will ahve children ijust spilled into it..
// like a first child anda s econd child? or and array...
// doesn't matter though
// parent is concerned wiht state
// should have 2 children...want a sepcific compontn..

type Props = {
  groupName: string,
  firstUsername: string,
  secondUsername: string,
};

export default class Group extends React.Component <Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}> {this.props.groupName} </Text>
        <Text style={styles.text}> {'\t'} { this.props.firstUsername} </Text>
        <Text style={styles.text}> {'\t'} {this.props.secondUsername} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: groupContainerStyle.backgroundColor,
    paddingTop: groupContainerStyle.paddingTop, // TODO: make this dynamic?
    paddingBottom: groupContainerStyle.paddingBottom,
    marginBottom: groupContainerStyle.marginBottom,
    borderRadius: groupContainerStyle.borderRadius,
    borderWidth: groupContainerStyle.borderWidth,
  },
  text: {
    fontSize: groupTextStyle.fontSize,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: groupTextStyle.fontSize,
    marginBottom: 3,
  },

});
