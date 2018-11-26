import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

type Props = {
  group: Object,
  onGroupClick: () => void,
  getColorStyle: () => void,
};

export default class AddGroup extends React.Component <Props> {
  render() {
    const { group } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={this.props.getColorStyle(group.color)}
          onPress = {() => this.props.onGroupClick(group.name)}
        >
          <Text> {group.name} </Text>
          <Text> X </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
