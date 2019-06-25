import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';


import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Svg } from 'expo';


import AddGroup from '../../../../assets/add-group.svg';
import AddUser from '../../../../assets/add-user.svg';

import colors from '../../styles/colors';

import {
  addSvgHeightOrWidth,
  addContainer,
} from '../../styles/base';

import {
  // circle
  circlecx,
  circlecy,
  radiusCircle,
  circleFill,
  // circle border
  circleBorderStroke,
  cirlceBorderfill,
  circleBorderStrokeWidth,

  addPolygonHorizontalLine,
  addPolygonVerticalLine,

} from '../../styles/svg/add';

const { Circle, Polygon } = Svg;

/**
 * this footer always assumes there will always be a sort and add button. only the filter button is optional
 */
class Footer extends React.Component {
  render() {
    if (this.props.addGroupCB) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={addContainer}
            onPress = {this.props.addGroupCB}
          >
            <AddGroup width={addSvgHeightOrWidth} height={addSvgHeightOrWidth} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={addContainer}
          onPress = {this.props.navigateToAddUserScreen}
        >
          <AddUser width={addSvgHeightOrWidth} height={addSvgHeightOrWidth} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addGroupContainer: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 40,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

Footer.propTypes = {
  navigateToAddUserScreen: PropTypes.func.isRequired,
};

export default Footer;
