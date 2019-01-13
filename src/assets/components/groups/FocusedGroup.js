import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


type Props = {
  group: Object,
  getColorStyle: (String, Boolean, Object) => Object,
};

/**
 * NOTE: had to use touchable highlight instead of touchable opacity because of
 * https://github.com/styled-components/styled-components/issues/1795.
 * NOTE: touchable highlight must take one and only 1 child, hence view wrapper
 */
export default class FocusedGroup extends React.Component <Props> {
  render() {
    const { group } = this.props;
    return (
      <View style={styles.groupIconNameContainer}>
        <View style={this.props.getColorStyle(group.color)} />
        <Text numberOfLines={1}> {group.name} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  groupIconNameContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
});
