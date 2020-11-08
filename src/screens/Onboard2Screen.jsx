
import React, { useState, useEffect } from 'react'
import { useHeaderHeight } from '@react-navigation/stack'
import Tooltip from 'react-native-walkthrough-tooltip';
import { TextInput } from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

// Components
import ButtonPrimary from '../components/ButtonPrimary'
import ProgressBar from '../components/ProgressBar'

// Elements
import Title from '../elements/Title'
import Paragraph from '../elements/Paragraph'

// Constants
import { CONTAINER } from '../constants/Styles'

export default function Onboard2Screen({
  navigation,
}) {
  const headerHeight = useHeaderHeight();
  const [ showTip, setTip ] = useState(false)

  useEffect(() => {
    // we can't just do useState(true), because there's some weird timing issue
    // so we need to do this stupid hack to let everything mount first
    setTimeout(() => setTip(true), 10)
  }, [])

  return (
    <KeyboardAvoidingView
      // need below from https://medium.com/@nickyang0501/keyboardavoidingview-not-working-properly-c413c0a200d4
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
      // need below from https://stackoverflow.com/a/51169574 
      keyboardVerticalOffset={headerHeight}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
          <Tooltip
            isVisible={showTip}
            content={
              <>
                <Title style={{ color: 'black' }}>Add a Group</Title>
                <Paragraph>
                  Groups contain people that are related in some way
                </Paragraph>
              </>
            }
            placement="bottom"
            onClose={() => setTip(false)}
          >
            <TextInput
              onFocus={() => setTip(false)}
              mode="outlined"
              placeholder="Name (e.g. Work)"
              style={{ width: "100%"}} // need this for whatever reason.
            />
          </Tooltip>
            <View style={{ flex : 1 }} />
            <View>
              <ProgressBar progress={0.33} />
              <ButtonPrimary onPress={() => navigation.replace('Home')}>
                Save
              </ButtonPrimary>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...CONTAINER,
    justifyContent: 'space-around'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
