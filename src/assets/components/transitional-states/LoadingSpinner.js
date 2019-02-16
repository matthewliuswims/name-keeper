import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { loadingContainer } from '../../styles/base';

export default function LoadingSpinner() {
  return (
    <View style={loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
