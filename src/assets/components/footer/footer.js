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

import {
  filterSvgHeightOrWidth,
  point1,
  point2,
  point3,
  point4,
  point5,
  point6,
  filterContainer,
} from '../../styles/svg/filter';

import {
  sortSvgWidth,
  sortSvgHeight,
  triangle1Points,
  triangle2Points,
  sortContainer,
} from '../../styles/svg/sort';


const { Circle, Polygon } = Svg;

/**
 * this footer always assumes there will always be a sort and add button. only the filter button is optional
 */
class Footer extends React.Component {
  filterComponent() {
    return (
      <TouchableOpacity
        style={filterContainer}
        onPress = {() => this.props.filterCB()}
      >
        <Svg
          height={filterSvgHeightOrWidth}
          width={filterSvgHeightOrWidth} // same as height
        >
          <Polygon
            points = {`
              ${point1},
              ${point2},
              ${point3},
              ${point4},
              ${point5},
              ${point6},
            `}
            stroke="black"
            strokeWidth="1"
            fill="black"
          />
        </Svg>
      </TouchableOpacity>
    );
  }

  sortComponent() {
    return (
      <TouchableOpacity
        style={sortContainer}
        onPress = {() => this.props.sortCB()}
      >
        <Svg
          height={sortSvgHeight}
          width={sortSvgWidth}
        >
          <Polygon
            points={triangle1Points}
            fill='black'
          />
          <Polygon
            points={triangle2Points}
            fill='black'
          />
        </Svg>
      </TouchableOpacity>
    );
  }

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
    const { filterCB, numberUsers } = this.props;

    if (!numberUsers) {
      return (
        <View style={styles.containerPlusOnly}>
          { this.plusComponent()}
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.filterSort}>
          { this.sortComponent()}
          { filterCB && this.filterComponent()}
        </View>
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
  filterSort: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1, // if uncomment, you'll see difference
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

Footer.propTypes = {
  navigateToAddUserScreen: PropTypes.func.isRequired,
  filterCB: PropTypes.func,
  sortCB: PropTypes.func.isRequired,
  numberUsers: PropTypes.number,
};

Footer.defaultProps = {
  filterCB: null,
  numberUsers: 0,
};

export default Footer;
