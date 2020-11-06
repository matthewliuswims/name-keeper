import React from 'react'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function Onboard1Screen({
  navigation,
}) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>zOnboard screen 1</Text>
      <TouchableOpacity onPress={() => navigation.replace('Onboarding', { screen: 'Onboard2'})} style={styles.link}>
        <Text style={styles.linkText}>Go to home onboard2!</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Onboard1Screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
