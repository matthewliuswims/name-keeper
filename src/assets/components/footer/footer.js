import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Svg } from 'expo';

import { container } from '../../styles/base';

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
  // lines
  lineStroke,
  lineStrokeWidth,
  // line1
  line1XPoint1,
  line1YPoint1,

  line1XPoint2,
  line1YPoint2,
  // line2
  line2XPoint1,
  line2YPoint1,

  line2XPoint2,
  line2YPoint2,

  addContainer,
} from '../../styles/svg/add';

const { Circle, Line } = Svg;

class Footer extends React.Component {
  plusComponent() {
    return (
      <TouchableOpacity
        style={styles.addContainer}
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
          <Line
            x1={line1XPoint1}
            y1={line1YPoint1}
            x2={line1XPoint2}
            y2={line1YPoint2}
            stroke={lineStroke}
            stroke-width={lineStrokeWidth}
          />
          <Line
            x1={line2XPoint1}
            y1={line2YPoint1}
            x2={line2XPoint2}
            y2={line2YPoint2}
            stroke={lineStroke}
            stroke-width={lineStrokeWidth}
          />
        </Svg>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { this.plusComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex, // if uncomment, you'll see difference
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: color.footerBackgroundColor,
  },
  addContainer: {
    marginBottom: addContainer.marginBottom,
    marginRight: addContainer.marginRight,
  },
});

Footer.propTypes = {
  navigateToAddUserScreen: PropTypes.func.isRequired,
};

export default Footer;
