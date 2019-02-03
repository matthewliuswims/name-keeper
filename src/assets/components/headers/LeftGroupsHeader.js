import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class LeftGroupsHeader extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.swap}>
        <Icon
          name='swap-horiz'
          color='white'
        />
        {this.props.showingGroups ? <Text style={{ color: 'white' }}> People </Text>
          : <Text style={{ color: 'white' }}>  Groups </Text>
        }
      </TouchableOpacity>
    );
  }
}

LeftGroupsHeader.propTypes = {
  swap: PropTypes.func.isRequired,
  showingGroups: PropTypes.bool,
};

LeftGroupsHeader.defaultProps = {
  showingGroups: true,
};
