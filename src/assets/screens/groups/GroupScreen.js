import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { container } from '../../styles/base';

import Footer from '../../components/footer/footer';


type Props = {
  groupsState : {
    focusedGroup: Object,
  }
};

class GroupScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Group Screen',
    // header: ({ goBack }) => ({
    //   left: (<Ionicons name='chevron-left' onPress={() => { goBack(); }} />),
    // }),
  };
  // @TODO: USE LODASH GET BELOW INSTEAD OF THE &&

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.groupContents}>
          <Text> asd </Text>
          <Text> {get(this.props.groupsState, 'focusedGroup', null)} </Text>
        </View>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default connect(mapStateToProps)(GroupScreen);


const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    backgroundColor: container.backgroundColor,
  },
  groupContents: {
    flex: 11,
  },
  footer: {
    flex: 1,
  },
});
