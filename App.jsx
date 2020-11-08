import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) return null

  const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      ...NavigationDefaultTheme.colors,
      // react native paper
      primary: '#007AFF', // this changes contained button color text
      accent: '#9013FE',
    
      // navigation
      card: '#007AFF', // e background color of card-like elements, such as headers, tab bars etc.
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

  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={theme}
        >
          <Navigation />
        </NavigationContainer>
        <StatusBar />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
