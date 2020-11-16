import * as React from "react";
import { useHeaderHeight } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

// import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

// Constants
import { CONTAINER } from "../constants/Styles";

export default function ViewContainer({
  children,
  style: styleParam,
  keyboardVerticalOffset,
}) {
  const headerHeight = useHeaderHeight();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log("dismissal");
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // need below from https://medium.com/@nickyang0501/keyboardavoidingview-not-working-properly-c413c0a200d4
        behavior={Platform.OS === "ios" ? "height" : null}
        // need below from https://stackoverflow.com/a/51169574
        keyboardVerticalOffset={keyboardVerticalOffset || headerHeight}
      >
        <SafeAreaView style={[CONTAINER, styleParam]}>{children}</SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
