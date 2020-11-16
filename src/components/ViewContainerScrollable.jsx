import * as React from "react";
import { useHeaderHeight } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
} from "react-native";

// Constants
import { CONTAINER } from "../constants/Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ViewContainerScrollable({
  children,
  style: styleParam,
}) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAwareScrollView
      behavior="padding"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[CONTAINER, styleParam]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
