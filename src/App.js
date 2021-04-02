import { StatusBar } from "expo-status-bar";
import { registerRootComponent } from "expo";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";

import { Provider as PaperProvider } from "react-native-paper";

import { Provider as StoreProvider } from "react-redux";

import store from "./store";

import useCachedResources from "./hooks/useCachedResources";
import useTheme from "./hooks/useTheme";
import Navigation from "./navigation";

import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

function App() {
  const isLoadingComplete = useCachedResources();
  const theme = useTheme();

  if (!isLoadingComplete) return null;

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer theme={theme}>
            <Navigation />
          </NavigationContainer>
          <StatusBar />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}

export default registerRootComponent(App);
