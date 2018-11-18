import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { groupContainerStyle, groupTextStyle } from '../../styles/group';

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
