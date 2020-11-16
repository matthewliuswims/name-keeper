import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

// Screens
import NotFoundScreen from "../screens/NotFoundScreen";

import BottomTabNavigator from "./BottomTabNavigator";
import OnboardingNavigator from "./OnboardingNavigator";

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) || "People";

  switch (routeName) {
    case "People":
      return "People";
    case "Groups":
      return "Groups";
  }
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Onboarding"
        component={OnboardingNavigator}
      />
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
        })}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

export default Navigation;
