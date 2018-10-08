/* eslint no-eval: 0 */

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const filterSvgHeightOrWidth = wp('8%');

export const point1 = '0 0';

const point2XAsNum = eval(`0.4 * ${filterSvgHeightOrWidth}`);
const point2YAsNum = eval(`0.4 * ${filterSvgHeightOrWidth}`);

export const point2 = `${point2XAsNum} ${point2YAsNum}`;

const point3XAsNum = point2XAsNum;
const point3YAsNum = eval(`0.7 * ${filterSvgHeightOrWidth}`);

export const point3 = `${point3XAsNum} ${point3YAsNum}`;

const point4XAsNum = eval(`0.6 * ${filterSvgHeightOrWidth}`);
const point4YAsNum = eval(`0.6 * ${filterSvgHeightOrWidth}`);

export const point4 = `${point4XAsNum} ${point4YAsNum}`;

const point5XAsNum = eval(`0.6 * ${filterSvgHeightOrWidth}`);
const point5YAsNum = eval(`0.4 * ${filterSvgHeightOrWidth}`);

export const point5 = `${point5XAsNum} ${point5YAsNum}`;

const point6XAsNum = eval(`1.0 * ${filterSvgHeightOrWidth}`);
const point6YAsNum = 0;

export const point6 = `${point6XAsNum} ${point6YAsNum}`;

export const filterContainer = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginLeft: wp('3%'),
};
