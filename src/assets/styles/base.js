import { Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from 'react-native-responsive-screen';

export const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
};

export const sectionHeader = {
  color: 'white',
  backgroundColor: '#499EFF',
  headerLayoutPreset: 'center',
};

// the overarching container for a screen
export const container = {
  flex: 1,
  paddingTop: hp('3%'),
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
