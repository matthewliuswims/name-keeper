import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import { Svg } from 'expo';
import colors from '../../styles/colors';

import {
  addGroupButtonText,
  addGroupButton,
} from '../../styles/base';

import {
  addSvgHeightOrWidth,
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

  addContainer,
} from '../../styles/svg/add';

const { Circle, Polygon } = Svg;

/**
 * this footer always assumes there will always be a sort and add button. only the filter button is optional
 */
class Footer extends React.Component {
  render() {
    if (this.props.addGroupCB) {
      return (
        <View elevation={5} style={styles.addGroupContainer}>
          <TouchableOpacity
            onPress = {this.props.addGroupCB}
            style={addGroupButton}
          >
            <Text style={addGroupButtonText}>Add Group</Text>
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
          <Svg
            height={addSvgHeightOrWidth}
            width={addSvgHeightOrWidth}
          >
            <Circle
              cx={circlecx}
              cy={circlecy}
              r={radiusCircle}
              fill={circleFill}
            />
            <Circle
              cx={circlecx}
              cy={circlecy}
              r={radiusCircle}
              stroke={circleBorderStroke}
              fill={cirlceBorderfill} // transparent
              stroke-width={circleBorderStrokeWidth}
            />
            <Polygon
              points = {addPolygonHorizontalLine}
              stroke="white"
              strokeWidth="3"
              fill={colors.appThemeColor}
            />
            <Polygon
              points = {addPolygonVerticalLine}
              stroke="white"
              strokeWidth="3"
              fill={colors.appThemeColor}
            />
          </Svg>
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
