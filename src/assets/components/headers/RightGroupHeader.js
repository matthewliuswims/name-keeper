import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import { twoItemHeaderContainer } from '../../styles/base';

import RightTextHeader from './RightTextHeader';

class RightHeaderGroupComponent extends React.Component {
  render() {
    return (
      <View style={twoItemHeaderContainer}>
        <Icon
          onPress={() => {
            this.props.navigation.navigate('SearchScreen', {
              groupName: this.props.groupsState.focusedGroupName,
            });
          }}
          name='search'
          underlayColor='grey'
          color='white'
          iconStyle={{
            padding: hp('1.5%'),
          }}
        />
        <View style={styles.editContainer}>
          <RightTextHeader
            buttonOnPress={() => {
              this.props.navigation.navigate('EditGroupScreen');
            }}
            textDisplay='Edit'
            soleDisplay={false}
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  editContainer: {
    padding: hp('1.5%'),
  },
});
const mapStateToProps = state => (
  {
    groupsState: state.groups,
  }
);

export default withNavigation(connect(mapStateToProps)(RightHeaderGroupComponent));
