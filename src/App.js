import { StatusBar } from "expo-status-bar";
import { registerRootComponent } from "expo";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import { Provider as StoreProvider } from "react-redux";

import store from "./store";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) return null;

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      ...NavigationDefaultTheme.colors,
      // navigation
      // card: '#007AFF', // e background color of card-like elements, such as headers, tab bars etc.
    },
  };

  const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      ...NavigationDarkTheme.colors,
    },
  };

  const theme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

  const themeParsed = {
    ...theme,
    colors: {
      ...theme.colors,
      // react native paper
      primary: "#007AFF", // this changes contained button color text
      accent: "#9013FE",

      black: "#000000",
      card: "#007AFF",
      green: "#2E8B57",
      red: "#CC293C",
    },
  };

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={themeParsed}>
        <SafeAreaProvider>
          <NavigationContainer theme={themeParsed}>
            <Navigation />
          </NavigationContainer>
          <StatusBar />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}

export default registerRootComponent(App);
