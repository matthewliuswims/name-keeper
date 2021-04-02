import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CreateAccount from "../screens/CreateAccount";
import Onboard1Screen from "../screens/Onboard1Screen";
import Onboard2Screen from "../screens/Onboard2Screen";
import Onboard3Screen from "../screens/Onboard3Screen";

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        options={{ title: "Activate" }}
        options={{ headerShown: false }}
        name="CreateAccount"
        component={CreateAccount}
      />
      <Stack.Screen
        options={{ headerBackTitleVisible: false }}
        name="Onboard1"
        component={Onboard1Screen}
      />
      <Stack.Screen
        options={{ title: "Add Group" }}
        name="Onboard2"
        component={Onboard2Screen}
      />
      <Stack.Screen
        options={{ title: "Add Person" }}
        name="Onboard3"
        component={Onboard3Screen}
      />
    </Stack.Navigator>
  );
}
