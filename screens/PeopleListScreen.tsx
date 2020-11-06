import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text } from '../components/Themed';

// @TODO: try safeareaview?
export default function PeopleListScreen({
  navigation
}: any) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PeopleList Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Person')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to Person Screen!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
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
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  }
});
