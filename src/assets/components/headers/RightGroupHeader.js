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
import GroupMenu from '../menus/GroupMenu';
import { deleteGroup, listGroups } from '../../../redux/actions/groups';
import { listAllUsers } from '../../../redux/actions/users';

class RightHeaderGroupComponent extends React.Component {
  state = { opened: false, visibleModal: false };

  onOptionSelect = (value) => {
    if (value === 'Edit') {
      this.props.navigation.navigate('EditGroupScreen', {
        focusedGroupName: this.props.groupsState.focusedGroupName,
      });
    }
    if (value === 'Delete') {
      this.setState({ visibleModal: true });
      /*
       *  1.25) call redux action for delete
       *  1.5) react navigation change screen.
       */
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

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  onBackdropPress = () => {
    this.setState({ opened: false });
  }

  render() {
    const { opened } = this.state;
    return (
      <View style={styles.container}>
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
        <GroupMenu
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
              You will delete this group and all its users. This process cannot be done.
            </Text>
            <View style={styles.cancelDeleteContainer}>
              {this.renderCancel('Close', () => {
                this.setState({ visibleModal: false });
              })}
              {this.renderDelete('Delete', async () => {
                await this.props.navigation.navigate('GroupsScreen');
                await this.props.deleteGroup(this.props.groupsState.focusedGroupName);
                this.props.listAllUsers();
                this.props.listGroups();
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
  container: {
    flexDirection: 'row',
  },
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
  }
);
const mapDispatchToProps = dispatch => (
  {
    deleteGroup: groupName => dispatch(deleteGroup(groupName)),
    listGroups: () => dispatch(listGroups()),
    listAllUsers: () => dispatch(listAllUsers()),
  }
);

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RightHeaderGroupComponent));
