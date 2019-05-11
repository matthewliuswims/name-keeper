import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Svg } from 'expo';
import colors from '../../styles/colors';

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
  plusComponent() {
    return (
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
    );
  }


  render() {
    const { numberUsers } = this.props;

    if (!numberUsers) {
      return (
        <View style={styles.containerPlusOnly}>
          { this.plusComponent()}
        </View>
      );
    }

    return (
      <View style={styles.container}>
        { this.plusComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerPlusOnly: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    alignItems: 'center', // this is important to raise the plus icon
  },
  container: {
    flex: 1, // if uncomment, you'll see difference
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

Footer.propTypes = {
  navigateToAddUserScreen: PropTypes.func.isRequired,
  numberUsers: PropTypes.number,
};

Footer.defaultProps = {
  filterCB: null,
  numberUsers: 0,
};

export default Footer;
