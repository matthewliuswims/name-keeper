import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import AddGroup from '../../../../assets/add-group.svg';
import AddUser from '../../../../assets/add-user.svg';

import FadeInOut from '../animations/fade-in-out-add-button';


import {
  addSvgHeightOrWidth,
  addContainer,
} from '../../styles/base';


/**
 * this footer always assumes there will always be a sort and add button. only the filter button is optional
 */
class Footer extends React.Component {
  render() {
    const { navigateToAddUserScreen } = this.props;
    if (this.props.addGroupCB) {
      return (
        <FadeInOut style={styles.container}>
          <TouchableOpacity
            style={addContainer}
            onPress = {this.props.addGroupCB}
          >
            <AddGroup width={addSvgHeightOrWidth} height={addSvgHeightOrWidth} />
          </TouchableOpacity>
        </FadeInOut>
      );
    }
    return (
      <FadeInOut
        style={styles.container}
      >
        <TouchableOpacity
          style={addContainer}
          onPress = {navigateToAddUserScreen}
        >
          <AddUser width={addSvgHeightOrWidth} height={addSvgHeightOrWidth} />
        </TouchableOpacity>
      </FadeInOut>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

Footer.propTypes = {
  navigateToAddUserScreen: PropTypes.func.isRequired,
};

export default Footer;
