import * as React from 'react';
import { useHeaderHeight } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

// Constants
import { CONTAINER } from '../constants/Styles'

export default function ViewContainer({
  children,
  styles: stylesParam,
  haveKeyboardAvoidingView = true,
}) {
  const headerHeight = useHeaderHeight();
  if (haveKeyboardAvoidingView) {
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
            <View style={[CONTAINER, stylesParam]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[CONTAINER, stylesParam]}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
