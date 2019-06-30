import React from 'react';
import { Animated } from 'react-native';

import { PAGE_CONTENTS_FADE_IN_DURATION } from './DURATIONS';

export default class FadeIn extends React.Component {
  constructor(props) {
    super(props);
    this.fadeAnim = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(
      this.fadeAnim,
      {
        toValue: 1,
        duration: PAGE_CONTENTS_FADE_IN_DURATION,
      },
    ).start();
  }

  render() {
    const { fadeAnim } = this;

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
}
