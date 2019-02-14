import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default class LeftGroupsHeader extends React.Component {
  render() {
    const textStyles = {
      color: 'white',
      marginLeft: wp('1.5%'),
    };

    return (
      <TouchableOpacity onPress={this.props.swap}>
        <Icon
          name='swap-horiz'
          color='white'
        />
        {this.props.showingGroups ? <Text style={textStyles}>People</Text>
          : <Text style={textStyles}>Groups</Text>
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
