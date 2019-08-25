import React from 'react';
import { Animated } from 'react-native';

import * as DURATIONS from './DURATIONS';

export default class FadeInOut extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),
    visible: true,
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: DURATIONS.SIMPLE_FADE_IN_DURATION,
      },
    ).start(this.setState({
      visible: true,
    }));
  }

  render() {
    const { fadeAnim, visible } = this.state;
    if (visible) {
      return (
        <Animated.View
          style={{
            ...this.props.style,
            opacity: fadeAnim,
          }}
        >
          {this.props.children}
        </Animated.View>
      );
    }

    return null;
  }
}
