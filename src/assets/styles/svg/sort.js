
/* eslint no-eval: 0 */

/**
 * <?xml version="1.0" standalone="no"?>
<svg width="200" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
   <polygon points="0 100 100 100 50 0"
    fill="black"/>
    <polygon points="100 0 150 100 200 0"
    fill="black"/>
</svg>
 */
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const sortSvgWidth = wp('12%');
export const sortSvgHeight = wp('6%');
// 1st triangle

const firstPointXFirstTriangle = 0;
const firstPointYFirstTriangleCalc = eval(`0.5 * ${sortSvgWidth}`);
const firstPointYFirstTriangle = `${firstPointYFirstTriangleCalc}`;

const secondPointXFirstTriangle = firstPointYFirstTriangle;
const secondPointYFirstTriangle = firstPointYFirstTriangle;

const thirdPointXFirstTriangleCalc = firstPointYFirstTriangleCalc * 0.5;
const thirdPointXFirstTriangle = `${thirdPointXFirstTriangleCalc}`;
const thirdPointYFirstTriangle = '0';

export const triangle1Points = `${firstPointXFirstTriangle} ${firstPointYFirstTriangle}
 ${secondPointXFirstTriangle} ${secondPointYFirstTriangle}
${thirdPointXFirstTriangle} ${thirdPointYFirstTriangle}`;

// second triangle

const firstPointXSecondTriangle = firstPointYFirstTriangle;
const firstPointYSecondTriangle = '0';

const secondPointXSecondTriangleCalc = eval(`1.5 * ${firstPointXSecondTriangle}`);
const secondPointXSecondTriangle = `${secondPointXSecondTriangleCalc}`;
const secondPointYSecondTriangle = firstPointYFirstTriangle;

const thirdPointXSecondTriangle = `${sortSvgWidth}`;
const thirdPointYSecondTriangle = '0';

export const triangle2Points = `${firstPointXSecondTriangle} ${firstPointYSecondTriangle}
 ${secondPointXSecondTriangle} ${secondPointYSecondTriangle}
${thirdPointXSecondTriangle} ${thirdPointYSecondTriangle}`;

export const sortContainer = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginRight: wp('3%'),
};
