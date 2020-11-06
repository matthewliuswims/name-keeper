
import React, { useState } from 'react'
import Tooltip from 'react-native-walkthrough-tooltip';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Onboard2Screen({
  navigation,
}: any) {
  const [ showTip, setTip ] = useState(true)

  return (
    <View style={styles.container}>
      <Tooltip
        contentStyle={{ width: 200 }}
        isVisible={showTip}
        content={(
          <Text>Groups contain people that are related in some way</Text>
        )}
        placement="bottom"
        onClose={() => setTip(false)}
      >
        <Text style={styles.title}>Onboard screen 2</Text>
      </Tooltip>
      <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

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
