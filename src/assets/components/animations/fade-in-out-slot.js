import React from 'react';
import { Animated } from 'react-native';

import { SLOT_FADE_IN_DURATION } from './DURATIONS';

export default class FadeInOut extends React.Component {

  componentDidMount() {
    const { _animated } = this.props;
    Animated.timing(
      _animated,
      {
        toValue: 1,
        duration: SLOT_FADE_IN_DURATION,
      },
    ).start();
  }

  render() {
    const { _animated, style, children } = this.props;
    return (
      <Animated.View
        style={{
          ...style,
          opacity: _animated,
        }}
      >
        {children}
      </Animated.View>
    );
  }
}
