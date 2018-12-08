import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { Text, View, Button, StyleSheet } from 'react-native';
import RightHeaderComponent from '../../components/screen/RightHeaderComponent';
import { container } from '../../styles/base';

class UserScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('username'),
      headerRight: <RightHeaderComponent />,
      headerBackTitle: null,
    };
  };

  render() {
    const { usersState } = this.props;
    const user = usersState.focusedUser;

    return (
      <View style={styles.container}>
        { user
        && (
          <View>
            <View style={styles.userDateRow}>
              <Text> focused user name is: {user.name}</Text>
              <Text>date eventually</Text>
            </View>
            <Button
              title="Go to group screen via navigate"
              onPress={() => this.props.navigation.navigate('GroupsScreen')}
            />
            <Button
              title="Go to group screen via push (notice how back button is avialale)"
              onPress={() => this.props.navigation.push('GroupsScreen')}
            />
          </View>
          )
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex,
    paddingTop: container.paddingTop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDateRow: {
    flex: container.flex,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => (
  {
    usersState: state.users,
  }
);

export default connect(mapStateToProps)(UserScreen);
