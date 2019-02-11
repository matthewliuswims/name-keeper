import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import { topRightTextButtonContainer, topRightButtonText } from '../../styles/base';


class RighTextHeader extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.buttonOnPress}
        style={topRightTextButtonContainer}
      >
        <Text style={topRightButtonText}>{this.props.textDisplay}</Text>
      </TouchableOpacity>
    );
  }
}

RighTextHeader.propTypes = {
  buttonOnPress: PropTypes.func.isRequired,
  textDisplay: PropTypes.string.isRequired,
};

export default withNavigation(RighTextHeader);
