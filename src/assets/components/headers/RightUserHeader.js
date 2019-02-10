import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import { modalMsg, cancelButton, cancelButtonText, deleteButton, deleteButtonText } from '../../styles/base';
import colors from '../../styles/colors';
import UserMenu from '../menus/UserMenu';

import { deleteUser, listAllUsers } from '../../../redux/actions/users';

class RightUserHeader extends React.Component {
  state = { opened: false, visibleModal: false };

  onOptionSelect = (value) => {
    if (value === 'Delete') {
      this.setState({ visibleModal: true });
    }
    if (value === 'Edit') {
      this.props.navigation.navigate('EditUserScreen', {
        focusedUserName: this.props.usersState.focusedUser.name,
      });
    }
    this.setState({ opened: false });
  }

  onTriggerPress = () => {
    this.setState({ opened: true });
  }

  renderCancel = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderDelete = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  onBackdropPress = () => {
    this.setState({ opened: false });
  }

  render() {
    const { opened } = this.state;
    return (
      <View>
        <UserMenu
          opened={opened}
          onBackdropPress={this.onBackdropPress}
          onSelect={this.onOptionSelect}
          onTriggerPress={this.onTriggerPress}
        />
        <Modal isVisible={this.state.visibleModal}>
          <View style={styles.modalContent}>
            <Icon
              name='warning'
              color={colors.warningColor}
              size={wp('16%')}
            />
            <Text style={styles.modalHeader}>
              Are you sure?
            </Text>
            <Text style={styles.modalMsg}>
              This user will be deleted. This process cannot be done.
            </Text>
            <View style={styles.cancelDeleteContainer}>
              {this.renderCancel('Close', () => {
                this.setState({ visibleModal: false });
              })}
              {this.renderDelete('Delete', () => {
                this.props.deleteUser(this.props.usersState.focusedUser);
                this.props.listAllUsers();
                // so the back button is correct, else back button but would be deleted user screen
                this.props.navigation.popToTop();
                this.props.navigation.navigate('GroupScreen',
                  {
                    groupName: this.props.groupsState.focusedGroupName,
                  });
                this.setState({ visibleModal: false });
              })}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  cancelDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalHeader: {
    fontWeight: 'bold',
    fontSize: RF(2.5),
    marginTop: hp('2%'),
  },
  modalMsg,
  cancelButton,
  cancelButtonText,
  deleteButton,
  deleteButtonText,
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});


const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
  }
);
const mapDispatchToProps = dispatch => (
  {
    deleteUser: user => dispatch(deleteUser(user)),
    listAllUsers: () => dispatch(listAllUsers()),
  }
);

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RightUserHeader));
