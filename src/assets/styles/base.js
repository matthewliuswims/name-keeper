// @tutorial https://medium.com/@tommylackemann/managing-styles-in-react-native-3546d3482d73
// @tutorial https://medium.com/react-native-training/build-responsive-react-native-views-for-any-device-and-support-orientation-change-1c8beba5bc23
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from './colors';

export const sectionHeader = {
  color: 'white',
  backgroundColor: colors.appThemeColor,
  headerLayoutPreset: 'center',
};

export const toastWrapper = {
  width: wp('96%'),
  bottom: hp('14%'),
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  padding: 8,
};

export const modalHeader = {
  fontWeight: 'bold',
  fontSize: 20,
  marginBottom: 20,
  textAlign: 'center',
};

export const modalMessage = {
  fontSize: 16,
  borderBottomWidth: 2,
  marginBottom: 40,
  textAlign: 'center',
};


export const logoWrapper = {
  marginBottom: 40,
};
// the overarching container for a screen
export const container = {
  flex: 1,
  paddingTop: hp('3%'),
  backgroundColor: colors.containerBackgroundColor,
  paddingLeft: wp('4.5%'),
  paddingRight: wp('4.5%'),
};

export const modalContainer = {
  backgroundColor: 'white',
  padding: 30,
  borderRadius: 10,
};

export const noGroupsContainer = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: container.paddingLeft,
  paddingRight: container.paddingRight,
};

// used instead of container
export const userBoxContainer = {
  paddingLeft: wp('3%'),
  paddingRight: wp('3%'),
  flexDirection: 'row',
};


export const twoItemHeaderContainer = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const loadingContainer = {
  flex: 1,
  paddingTop: hp('3%'),
  backgroundColor: colors.containerBackgroundColor,
  paddingLeft: wp('3%'),
  paddingRight: wp('3%'),
  justifyContent: 'center',
  alignItems: 'center',
};

export const deleteContainer = {
  marginTop: hp('5%'),
  backgroundColor: colors.warningColor,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  borderRadius: 10,
};

export const deleteText = {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
};


export const topRightTextButtonContainerSolo = {
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 16,
  paddingRight: 16,

  backgroundColor: '#00000000',
  color: 'white',
};

export const togglePeopleGroupsWrapper = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: 2,
  paddingBottom: 2,
  paddingLeft: 16,
  paddingRight: 16,
};

export const topRightTextButtonContainer = {
  paddingTop: 2,
  paddingBottom: 2,
  paddingLeft: 8,
  paddingRight: 8,

  backgroundColor: '#00000000',
  color: 'white',
};

export const headerButtonWrapper = {
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 8,
  paddingRight: 8,
};

export const topRightButtonText = {
  color: 'white',
  fontWeight: 'bold',
};

// has no colors
export const horizontalGroupScreenButton = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#979797',
  shadowColor: '#979797',
  shadowOpacity: 0.8,
  shadowRadius: 2,
  shadowOffset: {
    height: 2,
    width: 2,
  },
};

export const addGroupButton = {
  backgroundColor: colors.addApplyColor,
  padding: 14,
  width: wp('80%'),
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 14,
  borderColor: '#979797',
  shadowColor: '#979797',
  shadowOpacity: 0.8,
  shadowRadius: 2,
  shadowOffset: {
    height: 2,
    width: 2,
  },
};


export const footerBottomDimensions = {
  marginRight: wp('6%'),
  marginBottom: hp('3%'),
};


export const innardsStyleContainer = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const groupIconContainer = {
  marginTop: hp('1%'),
};

export const checkBoxBase = {
  padding: 0,
  margin: 0,
};

export const circularGroupIcon = {
  height: 18,
  width: 18,
  borderRadius: 4,
  marginRight: wp('3%'),
  marginLeft: wp('3%'),
};

export const addGroupButtonText = {
  fontWeight: 'bold',
  color: 'white',
};

export const groupIconNameDateContainer = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  justifyContent: 'space-between',
};

export const boxHeaderText = {
  fontSize: 16,
  flex: 1,
  fontWeight: '600',
  marginRight: wp('2%'),
};


export const boxDateText = {
  color: colors.subTextColor,
};

export const boxDescription = {
  marginRight: wp('8%'),
  flex: 1, // if uncomment, you'll see difference
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const userDescriptionText = {
  color: colors.subTextColor,
};

export const groupIconNameContainer = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const groupColorBoxSliverLeftSide = {
  paddingTop: 10,
  paddingBottom: 10,
  width: 30,
  height: 76,
  marginRight: 8,
};

export const rightSideGroupBox = {
  justifyContent: 'center',
  // marginTop: 10,
};

export const groupBoxContainer = {
  flex: 1,
  flexDirection: 'row',
};

export const groupIconNameContainerEditAddUser = {
  paddingTop: 15,
  paddingBottom: 15,
  flexDirection: groupIconNameContainer.flexDirection,
};

export const modalMsg = {
  textAlign: 'center',
  marginTop: hp('2%'),
  marginBottom: hp('3%'),
};

export const modalFooterButton = {
  padding: 16,
};

export const modalFooterText = {
  fontSize: 20,
  color: colors.appThemeColor,
};

// e.g. filter and sort
export const modalContentNormal = {
  height: hp('60%'),
  backgroundColor: 'white',
  padding: 16,
  borderRadius: 4,
  borderColor: 'rgba(0, 0, 0, 0.1)',
};


export const modalFooterWrapper = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const groupHeaderTextStyle = {
  fontWeight: '600',
  fontSize: 22,
  marginBottom: 2,
};

export const groupTextStyle = {
  marginTop: 2,
  fontSize: 14,
  color: colors.subTextColor,
};

export const rightDrawerOpenValue = -140;

export const editRightSlot = {
  backgroundColor: '#cccc00',
  width: 70,
  justifyContent: 'center',
  alignItems: 'center',
};

export const editRightSlotText = {
  color: 'white',
  fontWeight: 'bold',
};

export const deleteRightSlot = {
  backgroundColor: colors.warningColor,
  width: 70,
  justifyContent: 'center',
  alignItems: 'center',
};

export const userContainerStyle = {
  paddingTop: 10,
  paddingBottom: 10,
  backgroundColor: colors.containerBackgroundColor,
};

export const groupContainerStyle = {
  paddingTop: userContainerStyle.paddingTop,
  paddingBottom: userContainerStyle.paddingBottom,
  backgroundColor: colors.containerBackgroundColor,
};

export const rowUserBack = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingTop: 5,
  paddingBottom: 5,
  height: '100%',
  // flex: 1,
};

export const initialGroupSelection = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const otherGroupSelection = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const sortFilterWrapper = {
  padding: 10,
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
};

export const sortFilterRow = {
  marginBottom: 10,
  display: 'flex',
  flexDirection: 'row',
};

export const sortFilterIconText = {
  color: colors.subTextColor,
  fontSize: 16,
};

export const addMessage = {
  fontSize: 18,
  textAlign: 'center',
  marginTop: 30,
};

export const addHeader = {
  fontWeight: 'bold',
  fontSize: 22,
  textAlign: 'center',
  marginTop: 10,
};
