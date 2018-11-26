// @tutorial https://medium.com/@tommylackemann/managing-styles-in-react-native-3546d3482d73

// @tutorial https://medium.com/react-native-training/build-responsive-react-native-views-for-any-device-and-support-orientation-change-1c8beba5bc23
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from './colors';

export const sectionHeader = {
  color: 'white',
  backgroundColor: colors.appThemeColor,
  headerLayoutPreset: 'center',
};

// the overarching container for a screen
export const container = {
  flex: 1,
  paddingTop: hp('3%'),
  backgroundColor: '#FFFFFF',
  paddingLeft: wp('3%'),
  paddingRight: wp('3%'),
};

export const topRightSaveButton = {
  paddingLeft: wp('3%'),
  paddingRight: wp('3%'),
  backgroundColor: '#00000000',
  color: 'white',
};

export const topRightSaveButtonText = {
  color: 'white',
  fontWeight: 'bold',
};

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
