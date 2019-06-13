/* eslint no-eval: 0 indent: 0 */
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../colors';
import { footerBottomDimensions } from '../base';

export const addSvgHeightOrWidth = wp('18%') > 100 ? 100 : wp('18%');

// CIRCLE
const circlecxAsNum = eval(`0.5 * ${addSvgHeightOrWidth}`);
export const circlecx = `${circlecxAsNum}`;

const circlecyAsNum = eval(`0.5 * ${addSvgHeightOrWidth}`);
export const circlecy = `${circlecyAsNum}`;

const radiusCircleCalc = eval(`0.48 * ${addSvgHeightOrWidth}`);
export const radiusCircle = `${radiusCircleCalc}`;

export const circleFill = colors.appThemeColor;

// CIRCLE WITH JUST THE BORDER
export const circleBorderStroke = colors.borderColor;
export const cirlceBorderfill = 'transparent';

const circleBorderStrokeWidthCalc = eval(`0.02 * ${addSvgHeightOrWidth}`);
export const circleBorderStrokeWidth = `${circleBorderStrokeWidthCalc}`;

// Lines
export const lineStroke = 'white';
const lineStrokeWidthCalc = eval(`0.05 * ${addSvgHeightOrWidth}`);
export const lineStrokeWidth = `${lineStrokeWidthCalc}`;
// Line 1 
  // point1
const line1XPoint1Num = eval(`0.3 * ${addSvgHeightOrWidth}`);
export const line1XPoint1 = `${line1XPoint1Num}`;

const line1YPoint1Num = eval(`0.5 * ${addSvgHeightOrWidth}`);
export const line1YPoint1 = `${line1YPoint1Num}`;
  // point 2
const line1XPoint2Num = eval(`0.7 * ${addSvgHeightOrWidth}`);
export const line1XPoint2 = `${line1XPoint2Num}`;

const line1YPoint2Num = eval(`0.5 * ${addSvgHeightOrWidth}`);
export const line1YPoint2 = `${line1YPoint2Num}`;

// Line 2
  // point1
const line2XPoint1Num = eval(`0.5 * ${addSvgHeightOrWidth}`);
export const line2XPoint1 = `${line2XPoint1Num}`;

const line2YPoint1Num = eval(`0.3 * ${addSvgHeightOrWidth}`);
export const line2YPoint1 = `${line2YPoint1Num}`;

  // point2
const line2XPoint2Num = eval(`0.5 * ${addSvgHeightOrWidth}`);
export const line2XPoint2 = `${line2XPoint2Num}`;

const line2YPoint2Num = eval(`0.7 * ${addSvgHeightOrWidth}`);
export const line2YPoint2 = `${line2YPoint2Num}`;

export const addPolygonHorizontalLine = `${line1XPoint1} ${line1YPoint1}
 ${line1XPoint2} ${line1YPoint2}
`;

export const addPolygonVerticalLine = `
${line2XPoint1} ${line2YPoint1}
${line2XPoint2} ${line2YPoint2}
`;

export const addContainer = {
  marginRight: footerBottomDimensions.marginRight,
  marginBottom: footerBottomDimensions.marginBottom,

  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowRadius: 2.5,
  shadowOpacity: 0.5,
};
