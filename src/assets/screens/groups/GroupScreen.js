import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, TouchableOpacity, Text, Animated } from 'react-native';
import Toast from 'react-native-easy-toast';

import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SwipeListView } from 'react-native-swipe-list-view';

import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import { parseToShortDate } from '../../../lib/dates';
import colors from '../../styles/colors';

import { listAllUsers, focusUser, deleteUser } from '../../../redux/actions/users';
import {
  container,
  userContainerStyle,
  rightDrawerOpenValue,
  deleteRightSlot,
  rowUserBack,
  sortFilterRow,
  logoWrapper,
  noGroupsContainer,
  addMessage,
  addHeader,
  toastWrapper,
} from '../../styles/base';

import {
  clearToast,
  addToast,
} from '../../../redux/actions/toasts';

import UserBox from '../../components/users/UserBox';

import Footer from '../../components/footer/footer';


import { SLOT_FADE_OUT_DURATION } from '../../components/animations/DURATIONS';


import LoadingSpinner from '../../components/transitional-states/LoadingSpinner';

import SortIcon from '../../components/icons/SortIcon';

import RightHeaderComponent from '../../components/headers/RightGroupHeader';

import ErrorModal from '../../components/modal/Error';

import DeleteModal from '../../components/modal/Delete';

import SortBy from '../../components/modal/SortBy';

import Logo from '../../../../assets/undraw_pilates_gpdb.svg';

import FadeInOut from '../../components/animations/fade-in-out-slot';

import FadeIn from '../../components/animations/fade-in';

type Props = {
  groupsState : {
    focusedGroupName: String,
  },
  usersState: {
    users: Array<Object>,
    focusedGroupName: String,
  },
  listAllUsers: () => Promise<Object>,
};

class GroupScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({ getGroupName: this.props.groupsState.focusedGroupName });
    // this.props.listAllUsers();
    this.offset = 0;
    this.state = {
      sortByModalOpen: false,
      sortOption: 'Date: Old to New (default)',
      direction: 'up',
      userDrawerFocused: null,
      deleteUserModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ groupSubmit: this.groupSubmit });
  }

  componentDidUpdate() {
    // for toasts
    const showToast = this.props.toastsState.showingToast;
    if (!showToast) return;
    const correctScreen = this.props.toastsState.screenName === this.props.navigation.state.routeName;
    // have to check ref existence, because of https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback
    if (showToast && this.toasteroni && correctScreen) {
      this.toasteroni.show(this.props.toastsState.message, 2000);
      // i have no idea why I need a timeout (and a timeout that is 1000)
      // but without it, the toast sometimes won't appear (if I go directly to the edit screen)
      // from the header
      setTimeout(() => this.props.clearToast(), 1000);
    }
  }

  static navigationOptions = ({ navigation }) => {
    // groupName is passed by navigateToScreen in adduserScreen
    const groupName = navigation.getParam('groupName') || navigation.getParam('getGroupName') || '';
    return {
      title: groupName,
      headerRight: <RightHeaderComponent />,
    };
  };


  // logic for delete modal user starts
  openUserDeleteModal = () => {
    this.setState({
      deleteUserModalOpen: true,
    });
  }

  closeUserDeleteModal = () => {
    this._swipeListUsersView.safeCloseOpenRow();
    this.setState({
      deleteUserModalOpen: false,
    });
  }

  deleteUser = async () => {
    this.closeUserDeleteModal();
    // change below to props to see if it'll be the same?
    Animated.timing(this.state.userDrawerFocused.animatedSlotOpacity, {
      toValue: 0,
      duration: SLOT_FADE_OUT_DURATION,
    }).start(async () => {
      this.props.addToast('Deleted Person', this.props.navigation.state.routeName);
      await this.props.deleteUser(this.state.userDrawerFocused);
      await this.props.listAllUsers();
      await this.setState({ userDrawerFocused: null });
      await this.setState({ deleteUserModalOpen: false });
    });
  }

  deleteUserModal = () => {
    if (this.state.deleteUserModalOpen) {
      return (
        <DeleteModal
          deleteModalOpen={this.state.deleteUserModalOpen}
          deleteFunc={this.deleteUser}
          closeDeleteModal={this.closeUserDeleteModal}
          currentFocusedScreen={this.props.navigation.isFocused()}
          deleteGroup={false}
        />
      );
    }
  }
  // logic for  delete modal user ends

  sortUsers(sortOption, users) {
    let sortedUsers;
    if (sortOption === 'Date: Old to New (default)') {
      sortedUsers = users.sort((a, b) => {
        // Turn strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        const aCreatedDate = new Date(a.createdDate);
        const bCreatedDate = new Date(b.createdDate);
        return aCreatedDate - bCreatedDate;
      });
    }

    if (sortOption === 'Date: New to Old') {
      sortedUsers = users.sort((a, b) => {
        // Turn strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
    }

    if (sortOption === 'Alphabetical') {
      sortedUsers = users.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }

    return sortedUsers;
  }

  openSortModal = () => {
    this.setState({
      sortByModalOpen: true,
    });
  }

  closeSortModal = () => {
    this.setState({
      sortByModalOpen: false,
    });
  }

  applySortModal = (sortOption) => {
    this.setState({
      sortByModalOpen: false,
    });
    this.props.addToast(`Sorting by ${sortOption}`, this.props.navigation.state.routeName);
    this.setSortOption(sortOption);
  }

  setSortOption(sortOption) {
    this.setState({
      sortOption,
    });
  }

  sortOpen() {
    if (this.state.sortByModalOpen) {
      return (
        <SortBy
          sortOption={this.state.sortOption}
          closeSortModal={this.closeSortModal}
          applySortModal={this.applySortModal}
        />
      );
    }
  }


  /**
   * will only get the users where user.primaryGroupName === groupName
   * @param {string} groupName
   */
  usersForGroup(groupName) {
    const { users } = this.props.usersState;
    if (!users) return [];
    const usersInGroup = this.props.usersState.users.filter((user) => {
      return user.primaryGroupName === groupName;
    });
    return usersInGroup;
  }

  noGroupContents() {
    return (
      <FadeIn style={noGroupsContainer}>
        <View style={logoWrapper}>
          <Logo width={hp('40%')} height={hp('40%')} />
        </View>
        <Text style={addHeader}>
          Add a person below!
        </Text>
        <Text style={addMessage}>
          Hint: the best time to add someone&#39;s name is right after you finish meeting them.
        </Text>
      </FadeIn>
    );
  }

  onScroll = (e) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    // @tutorial: https://stackoverflow.com/questions/41056761/detect-scrollview-has-reached-the-end
    const currentOffset = contentOffset.y; // offset is how far we've come from top of the list (e.g. 212 at end of list, 0 at start)
    const layoutMeasurementHeight = layoutMeasurement.height; // just the list height itself (e.g. 433)
    const contentSizeHeight = contentSize.height; // end-end scroll height (e.g. 645)

    const listIsNotFilled = contentSizeHeight < layoutMeasurementHeight;

    const pastEnd = layoutMeasurementHeight + currentOffset + 10 > contentSizeHeight; // to account for the ability to scroll past the end (i.e. the bounce);
    const pastTop = (currentOffset || this.offset) < 0;
    const movingDown = currentOffset > this.offset;
    let direction = 'up';
    if (movingDown || pastEnd) {
      direction = 'down';
    }
    if (pastTop || listIsNotFilled) {
      direction = 'up';
    }

    this.offset = currentOffset;
    this.setState({
      direction,
    });
  }

  groupContents(groupName) {
    const userForGroup = this.usersForGroup(groupName);
    const sortedUsers = this.sortUsers(this.state.sortOption, userForGroup);
    return (
      <SwipeListView
        data={sortedUsers}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress = {() => {
              this.props.focusUser(item);
              this.props.navigation.navigate('UserScreen', {
                fromGroupScreen: true,
              });
            }}
            style={userContainerStyle}
            activeOpacity={0.5}
            underlayColor={colors.touchableHighlightUnderlayColor}
          >
            <FadeInOut
              style={{ flex: 1 }}
              _animated={item.animatedSlotOpacity}
            >
              <UserBox
                primaryGroupName={item.primaryGroupName}
                username={item.name}
                userDescription={item.description}
                date={parseToShortDate(item.createdDate)}
              />
            </FadeInOut>
          </TouchableHighlight>
        )}
        onScroll={this.onScroll}
        scrollEventThrottle={120}
        ref={ref => this._swipeListUsersView = ref}
        renderHiddenItem={data => (
          <View style={rowUserBack}>
            <TouchableOpacity
              style={deleteRightSlot}
              onPress = {() => {
                const { item } = data;
                this.setState({ userDrawerFocused: item });
                this.openUserDeleteModal();
              }}
            >
              <Icon
                name='delete'
                color='white'
                size={35}
                iconStyle={{
                  padding: 10,
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        useFlatList
        extraData={this.props.usersState}
        rightOpenValue={rightDrawerOpenValue}
        disableRightSwipe
        keyExtractor={(item => `${item.userID}`)}
      />
    );
  }

  navigateToAddUserScreen = () => {
    this.props.navigation.navigate('AddUserScreen');
  }

  checkErrUsrs = (err) => {
    // don't want err to render if we're not even on the screen
    if (err) {
      return (
        <ErrorModal
          error={err}
          clearError={this.props.clearUsersErr}
          currentFocusedScreen={this.props.navigation.isFocused()}
        />
      );
    }
  }

  sortHeader = () => {
    return (
      <View style={sortFilterRow}>
        <SortIcon
          sortCB={this.openSortModal}
        />
      </View>
    );
  }

  render() {
    // messes with adding new users..
    // if (this.props.groupsState.loading || this.props.usersState.loading) {
    //   return (
    //     <LoadingSpinner />
    //   );
    //
    const { focusedGroupName } = this.props.groupsState;
    const NumUsersForGroup = this.usersForGroup(focusedGroupName).length;
    const showSortHeader = NumUsersForGroup > 0;
    const showFooterButton = this.state.direction === 'up';
    return (
      <View style={container}>
        <View style={styles.contents}>
          {showSortHeader && this.sortHeader()}
          {NumUsersForGroup ? this.groupContents(focusedGroupName) : this.noGroupContents()}
        </View>
        <Footer
          showAddUserButton={showFooterButton}
          navigateToAddUserScreen={this.navigateToAddUserScreen}
          sortCB={this.openSortModal}
          numberUsers={NumUsersForGroup}
        />
        {this.sortOpen()}
        {this.deleteUserModal()}
        {this.checkErrUsrs(this.props.usersState.error)}
        <Toast
          ref={ele => this.toasteroni = ele}
          style={toastWrapper}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contents: {
    flex: 11,
  },
  buttons: {
    marginBottom: hp('1%'),
  },
  buttonTextSortFilter: {
    color: 'white',
  },
});

const mapStateToProps = state => (
  {
    groupsState: state.groups,
    usersState: state.users,
    toastsState: state.toasts,
  }
);

const mapDispatchToProps = dispatch => (
  {
    addToast: (message, screenName) => dispatch(addToast(message, screenName)),
    clearToast: () => dispatch(clearToast()),
    listAllUsers: () => dispatch(listAllUsers()),
    deleteUser: user => dispatch(deleteUser(user)),
    focusUser: user => dispatch(focusUser(user)),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
