import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';


import RightTextHeader from './RightTextHeader';

class RightHeaderGroupComponent extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View>
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
        </View>
        <View style={styles.editContainer}>
          <RightTextHeader
            buttonOnPress={() => {
              this.props.navigation.navigate('EditGroupScreen', {
                focusedGroupName: this.props.groupsState.focusedGroupName,
              });
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
  container: {
    flexDirection: 'row',
  },
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
