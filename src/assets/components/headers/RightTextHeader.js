import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import { topRightTextButtonContainerSolo, topRightTextButtonContainer, topRightButtonText } from '../../styles/base';


class RightTextHeader extends React.Component {
  render() {
    const { soleDisplay } = this.props;
    const styleToShow = soleDisplay ? topRightTextButtonContainerSolo : topRightTextButtonContainer;
    return (
      <TouchableOpacity
        onPress={this.props.buttonOnPress}
        style={styleToShow}
      >
        <Text style={topRightButtonText}>{this.props.textDisplay}</Text>
      </TouchableOpacity>
    );
  }
}

RightTextHeader.propTypes = {
  buttonOnPress: PropTypes.func.isRequired,
  textDisplay: PropTypes.string.isRequired,
  soleDisplay: PropTypes.bool,
};

RightTextHeader.defaultProps = {
  soleDisplay: true,
};

export default withNavigation(RightTextHeader);
