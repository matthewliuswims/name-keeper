import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '../components/Themed';

export default function PersonScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Person Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
