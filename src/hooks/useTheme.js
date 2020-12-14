import React from "react";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";

import useColorScheme from "./useColorScheme";

export default function useTheme() {
  const colorScheme = useColorScheme();

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      ...NavigationDefaultTheme.colors,
      // navigation
      // card: '#007AFF', // background color of card-like elements, such as headers, tab bars etc.
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

  return themeParsed;
}
