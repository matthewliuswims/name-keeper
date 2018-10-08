import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import { Svg } from 'expo';
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

import { container } from '../../styles/base';
import color from '../../styles/colors';

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

import {
  sortSvgWidth,
  sortSvgHeight,
  triangle1Points,
  triangle2Points,
  sortContainer,
} from '../../styles/svg/sort';


const { Polygon, Circle, Line } = Svg;

class Footer extends React.Component {
  filterComponent() {
    return (
      <View style={styles.filterContainer}>
        <Text> Filter </Text>
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
      </View>
    );
  }

  plusComponent() {
    return (
      <View style={styles.addContainer}>
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('UserScreen')}
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
      </View>
    );
  }

  sortComponent() {
    return (
      <View style={styles.sortContainer}>
        <Text> Sort </Text>
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
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { this.filterComponent() }
        { this.plusComponent()}
        { this.sortComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: container.flex, // if uncomment, you'll see difference
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.footerBackgroundColor,
  },
  filterContainer: {
    marginLeft: filterContainer.marginLeft,
    flexDirection: filterContainer.flexDirection,
    justifyContent: filterContainer.justifyContent,
  },
  sortContainer: {
    flexDirection: sortContainer.flexDirection,
    justifyContent: sortContainer.justifyContent,
    marginRight: sortContainer.marginRight,
  },
  addContainer: {
    marginBottom: addContainer.marginBottom,
  },
});

export default withNavigation(Footer);
